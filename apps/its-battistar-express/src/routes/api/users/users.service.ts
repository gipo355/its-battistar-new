import { EStrategy, IAccount, IUser } from '@its-battistar/shared-types';
import { HydratedDocument } from 'mongoose';

import { AccountModel } from './accounts.model';
import { UserModel } from './users.model';

// TODO: complete this to reduce duplication in handlers

export const userExistsOrThrow = async ({
  data: { email, _id },
  error,
}: {
  data: {
    email?: string;
    _id?: string;
  };
  error: Error;
}): Promise<HydratedDocument<IUser>> => {
  const user = await UserModel.findOne({
    $or: [{ email }, { _id }],
  });
  if (!user) {
    throw error;
  }

  return user;
};

export const createUserAndAccount = async ({
  userData: { email, _id },
  accountData: { strategy, providerUid, accessToken },
}: {
  userData: {
    email?: string;
    _id?: string;
  };
  accountData: {
    strategy: keyof typeof EStrategy;
    providerUid: string;
    accessToken: string;
  };
}): Promise<
  | {
      user: HydratedDocument<IUser>;
      account: HydratedDocument<IAccount>;
    }
  | Error
> => {
  try {
    // get user
    const user = await UserModel.findOne({
      $or: [{ email }, { _id }],
    });

    // If user does not exist, create a new user and account
    // revert transaction if account creation fails
    if (!user) {
      try {
        const newUser = await UserModel.create({
          email,
        });
        const newAccount = await AccountModel.create({
          user: newUser._id,
          email,
          strategy,
          providerUid,
          accessToken: accessToken,
        });

        return { user: newUser, account: newAccount };
      } catch (error) {
        await UserModel.deleteOne({
          email,
        });
        await AccountModel.deleteOne({
          strategy,
          providerUid,
        });
        return new Error('Error creating fresh user and account');
      }

      // handle transaction manually because it's mongo
    } else {
      // if user exists, check if account already exists
      const account = await AccountModel.findOne({
        user: user._id,
        strategy,
      });
      if (account) return new Error('Account already exists');

      // If user exists but doesn't have account, create a new
      const newAccount = await AccountModel.create({
        user: user._id,
        strategy,
        ...(providerUid && { providerUid }),
      });
      return { user, account: newAccount };
    }
  } catch (error) {
    throw new Error('Error creating user and account');
  }
};
