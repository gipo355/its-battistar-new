import type {
  ELocalStrategy,
  ESocialStrategy,
  IAccount,
  IUser,
  TUserSafeWithAccounts,
} from '@its-battistar/shared-types';
import {
  EStrategy,
  LocalAccount,
  SocialAccount,
  User,
} from '@its-battistar/shared-types';
import type mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import type { AccountDocument } from './accounts.model';
import { AccountModel } from './accounts.model';
import type { UserDocument } from './users.model';
import { UserModel } from './users.model';

// TODO: use typescript conditionals to return the right types
/**
 * getAccountAndUserOrThrow is used to get an account and a user based on the provided account email, user id, and strategy.
 * This function takes an object as an argument and returns a Promise that resolves to an object containing a user, an account, and an error.
 *
 * either accountEmail or userId must be provided
 */
export const getAccountAndUserOrThrow = async ({
  accountEmail,
  userId,
  strategy,
}: {
  accountEmail?: string;
  strategy: keyof typeof EStrategy;
  userId?: string | mongoose.Types.ObjectId;
}): Promise<{
  account: AccountDocument | null;
  error: Error | null;
  user: UserDocument | null;
}> => {
  if (!accountEmail && !userId) {
    throw new Error('Either accountEmail or userId must be provided');
  }

  const account = await AccountModel.findOne({
    ...(accountEmail && { email: accountEmail }),
    ...(userId && { user: userId }),
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
      email: string;
      password: string;
      strategy: keyof typeof ELocalStrategy;
    }
  | {
      accessToken: string;
      email: string;
      providerUid: string;
      strategy: keyof typeof ESocialStrategy;
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
export const createOrFindUserAndAccount = async (
  a: ICreateUserAndAccount
): Promise<{
  account: HydratedDocument<IAccount> | null;
  error: Error | null;
  user: HydratedDocument<IUser> | null;
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
    const foundAccountWithSameStrat = accounts.find(
      (account) => account.strategy === a.strategy
    );

    // if it's local, return error
    // can't recreate local account, we split signup and login handlers for local
    if (foundAccountWithSameStrat?.strategy === EStrategy.LOCAL) {
      return {
        user: null,
        account: null,
        error: new Error('Account already exists'),
      };
    }

    // if account exists with different strategies, add account to user unless it's local

    /**
     * VULN:
     * IMPORTANT: FOR LOCAL STRATEGY, WE NEED EMAIL VERIFICATION 100%
     * or anyone can get access to the account
     * for now, we will only allow local strategy if the user is new and has no accounts
     *
     * this means, a user cannot add a local account to an existing account with social
     * strategies if they can't verify the email or they get access to the account
     * without proof of ownership
     * can be allowed only if first signup or from inside the account settings
     * but it's still better to have email verification
     */

    // if user exists and wanted signup strategy is local, throw error (for now)
    // this step is necessary because we won't allow adding local strats
    if (accounts.length && a.strategy === EStrategy.LOCAL) {
      return {
        user: null,
        account: null,
        error: new Error('Account already exists'),
      };
    }

    // if user exists, account exists, return user and account
    // if user exists, accounts doesn't exist and strategy is not local, create account
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

      // user exists, account exists, return user and account for login
      if (foundAccountWithSameStrat) {
        return {
          user,
          account: foundAccountWithSameStrat,
          error: null,
        };
      }

      // if user exists, account does not exist, create account
      const account = await AccountModel.create(
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

    // VULN: potential for account takeover?

    // if user does not exist (no account with email), create user and account
    if (!accounts.length) {
      const user = await UserModel.create(
        new User({
          username: a.email,
          role: 'USER',
        })
      );

      // handle local strategy
      if (a.strategy === EStrategy.LOCAL) {
        const account = await AccountModel.create(
          new LocalAccount({
            user: user._id.toString(),
            email: a.email,
            primary: true,
            password: a.password,
          })
        );

        return { user, account, error: null };
      }

      // handle social strategy
      const account = await AccountModel.create(
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

/**
 * @description
 * findUserWithAccounts is used to find a user with their accounts based on the provided user id.
 * It uses the `aggregate` method of the `UserModel` to query
 * the database and populate the `accounts` field of the user.
 *
 * It also omits sensitive data such as passwords and inactive accounts from the response.
 */
export const findUserWithAccounts = async (
  id: string
): Promise<{
  error: Error | null;
  user: TUserSafeWithAccounts[];
}> => {
  const user = await UserModel.aggregate([
    {
      $match: {
        _id: id,
      },
      // $limit: 1,
    },
    // populate accounts
    // transform _id into id for accounts and user
    {
      $set: {
        id: '$_id',
      },
    },
    // remove useless fields from user, exclude by default
    {
      $project: {
        id: 1,
        username: 1,
        avatar: 1,
        createdAt: 1,
        updatedAt: 1,
        accounts: 1,
        _id: 0,
        // role: 1, // we don't want to expose the role to the client
        // todos: 0,
        // __v: 0,
      },
    },
    // populate accounts field with accounts
    {
      $lookup: {
        from: 'accounts',
        localField: 'id', // we swapped _id to id
        foreignField: 'user',
        as: 'accounts',
        // Sub pipeline to filter out inactive accounts and sensitive data
        pipeline: [
          // filter out active: false accounts
          {
            $match: {
              active: true,
            },
          },
          // remove sensitive data
          // giving 1s to the fields to include, exclude by default to prevent
          // unexpected data leaks
          {
            $set: {
              id: '$_id',
            },
          },
          {
            $project: {
              id: 1,
              email: 1,
              strategy: 1,
              primary: 1,
              verified: 1,
              createdAt: 1,
              updatedAt: 1,
              _id: 0,
            },
          },
        ],
      },
    },
  ]);

  if (!user.length) {
    return {
      user: [],
      error: new Error('User not found'),
    };
  }

  return {
    user: user as TUserSafeWithAccounts[],
    error: null,
  };
};
