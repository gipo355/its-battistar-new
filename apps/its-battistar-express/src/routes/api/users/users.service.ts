import {
  ESocialStrategy,
  EStrategy,
  IAccount,
  IUser,
  LocalAccount,
  SocialAccount,
  User,
} from '@its-battistar/shared-types';
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

type ICreateUserAndAccount =
  | {
      strategy: typeof EStrategy.LOCAL;
      email: string;
      password: string;
    }
  | {
      strategy: keyof typeof ESocialStrategy;
      providerUid: string;
      accessToken: string;
      email: string;
    };

export const createUserAndAccount = async (
  a: ICreateUserAndAccount
): Promise<{
  user: HydratedDocument<IUser> | null;
  account: HydratedDocument<IAccount> | null;
  error: Error | null;
}> => {
  // TODO: must to transaction.
  // must be able to rollback if one fails

  // this method is used to register a user
  // it will be email based
  // if it signs up with the same email as an existing user, it will add the account to the existing user
  // if it's different, it will create a new user and account

  // if a user wants to add a different email to their  account, it has to be done manually, not while signing up
  // there is no way to differentiate between a new user and an existing user with a different email

  // inside the try, we return errors so that we can wrap them in AppError to mark operational errors
  // if its unhandled, it will throw and be caught by the global error handler as not operational
  try {
    // get accounts
    const accounts = await AccountModel.find({
      email: a.email,
    });

    // check if account already exists with same strategy
    if (
      accounts.length &&
      accounts.some((account) => account.strategy === a.strategy)
    ) {
      return {
        user: null,
        account: null,
        error: new Error('Account already exists'),
      };
    }

    // if account exists with different strategies, add account to user
    // IMPORTANT: FOR LOCAL STRATEGY, WE NEED EMAIL VERIFICATION 100%
    // or anyone can get access to the account
    // for now, we will only allow local strategy if the user is new and has no accounts

    // if user exists and strategy is not local, add account
    if (accounts.length && a.strategy !== EStrategy.LOCAL) {
      // get user
      const user = await UserModel.findOne({
        // eslint-disable-next-line no-magic-numbers
        _id: accounts[0].user,
      });
      if (!user) {
        return new Error('Error getting user');
      }
      const account = new AccountModel(
        new SocialAccount({
          user: user._id.toString(),
          email: a.email,
          primary: false,
          verified: true,
          strategy: a.strategy,
          providerId: a.providerUid,
          providerAccessToken: a.accessToken,
        })
      );

      return { user, account, error: null };
    }

    // if user exists and wanted signup strategy is local, throw error (for now)
    if (accounts.length && a.strategy === EStrategy.LOCAL) {
      return {
        user: null,
        account: null,
        error: new Error('Account already exists'),
      };
    }

    // if user does not exist, create user and account
    if (!accounts.length) {
      const user = new UserModel(
        new User({
          username: a.email,
          role: 'USER',
        })
      );
      await user.save();

      // handle local strategy
      if (a.strategy === EStrategy.LOCAL) {
        const account = new AccountModel(
          new LocalAccount({
            user: user._id.toString(),
            email: a.email,
            primary: true,
            password: a.password,
          })
        );
        await account.save();

        return { user, account, error: null };
      }

      // handle social strategy
      const account = new AccountModel(
        new SocialAccount({
          user: user._id.toString(),
          email: a.email,
          primary: true,
          verified: true,
          strategy: a.strategy,
          providerId: a.providerUid,
          providerAccessToken: a.accessToken,
        })
      );
      await account.save();

      return { user, account, error: null };
    }

    // fallback
    return {
      user: null,
      account: null,
      error: new Error('Error creating user and account'),
    };
  } catch (error) {
    throw new Error('Error creating user and account');
  }
};

export const addAccountToUser = (): void => {
  // this method will add an account to a user
  // allowing different email addresses to be associated with a single user
  throw new Error('Not implemented');
};
