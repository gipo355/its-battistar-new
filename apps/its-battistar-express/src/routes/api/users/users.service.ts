import {
  ELocalStrategy,
  ESocialStrategy,
  EStrategy,
  IAccount,
  IUser,
  LocalAccount,
  SocialAccount,
  User,
} from '@its-battistar/shared-types';
import { HydratedDocument } from 'mongoose';

import { AccountDocument, AccountModel } from './accounts.model';
import { UserDocument, UserModel } from './users.model';

// TODO: use typescript conditionals to return the right types
export const getAccountAndUserOrThrow = async ({
  email,
  strategy,
}: {
  email: string;
  strategy: keyof typeof EStrategy;
}): Promise<{
  user: UserDocument | null;
  account: AccountDocument | null;
  error: Error | null;
}> => {
  const account = await AccountModel.findOne({
    email,
    strategy,
  });

  if (!account) {
    return {
      user: null,
      account: null,
      error: new Error('Account not found'),
    };
  }

  const user = await UserModel.findOne({
    _id: account.user,
  });

  if (!user) {
    return {
      user: null,
      account: null,
      error: new Error('User not found'),
    };
  }

  return {
    user,
    account,
    error: null,
  };
};

type ICreateUserAndAccount =
  | {
      strategy: keyof typeof ELocalStrategy;
      email: string;
      password: string;
    }
  | {
      strategy: keyof typeof ESocialStrategy;
      providerUid: string;
      accessToken: string;
      email: string;
    };

/**
 *
 * createUserAndAccount is used to register a user and create an account for them.
 * This function takes an object of type `ICreateUserAndAccount` as an argument and returns a Promise that resolves to an object containing a user, an account, and an error.
 *
 * The function begins by trying to find any existing accounts with the same email as the one provided in the argument object.
 * If an account with the same email and strategy already exists, the function returns an error stating "Account already exists".
 *
 * If an account with the same email but a different strategy exists, and the strategy is not local, the function adds a new account to the existing user.
 * It creates a new `SocialAccount` and returns the user and the new account.
 * However, if the strategy is local, the function returns an error stating "Account already exists".
 *
 * If no account with the same email exists, the function creates a new user and account.
 * If the strategy is local, it creates a new `LocalAccount`, saves it, and returns the user and the new account.
 * If the strategy is not local, it creates a new `SocialAccount`, saves it, and returns the user and the new account.
 *
 * If any error occurs during the execution of the function, it is caught and a new error stating "Error creating user and account" is thrown.
 * If none of the conditions are met, the function falls back to returning an object with null user and account and an error stating "Error creating user and account".
 *
 * This function is a part of a larger user management system where users can have multiple accounts with different strategies (local or social).
 * The function ensures that a user cannot have multiple accounts with the same strategy and that a new user and account are created only when no account with the same email exists.
 *
 */
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
        return {
          user: null,
          account: null,
          error: new Error('User not found'),
        };
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
  console.log('method not implemented');
};
