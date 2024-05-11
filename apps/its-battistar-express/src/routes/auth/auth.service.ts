import type { IUser } from '@its-battistar/shared-types';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { sessionRedisConnection } from '../../db/redis';
import {
  clearTokens,
  invalidateAllSessionsForUser,
  verifyJWT,
} from '../../utils';
import { AppError } from '../../utils/app-error';
import { catchAsync } from '../../utils/catch-async';
import { getAccountAndUserOrThrow } from '../api/users/users.service';

interface IProtectRouteOptions {
  /**
   * Array of roles that are allowed to access the route.
   * Default is empty array, which means all roles are allowed.
   */
  restrictTo?: IUser['role'][];

  /**
   * The type of token to check.
   * This allows using this middleware for both
   * client access token strategy and api keys refresh token strategy.
   * Default is 'access_token'.
   */
  type: 'access_token' | 'refresh_token';
}

type TProtectRoute = (
  options?: IProtectRouteOptions
) => ReturnType<typeof catchAsync>;

/**
 * Authenticate user and check if user is logged in
 * Restrict access to certain roles if param restrictTo is provided
 */
export const protectRoute: TProtectRoute = (
  { restrictTo = [], type = 'access_token' } = {
    restrictTo: [],
    type: 'access_token',
  }
) =>
  catchAsync(async (req, res, next) => {
    // TODO: logic for active was moved to accounts model

    // STEP 1: Get the tokens
    // STEP 1: Verify the jwt with jose
    // STEP 2: Check if user still exists and is active
    // STEP 3: Find the strategy used to login from token
    // STEP 4: Check if user is active
    // STEP 4b: Check if user is not banned or has the role
    // STEP 5: Find the user from the database and add it to the request object

    const { token, error } = getAuthTokenFromCookieOrHeader({
      request: req,
      type,
    });

    if (error) {
      res.clearCookie(type);
      throw new AppError(error.message, StatusCodes.UNAUTHORIZED);
    }

    // verify the token
    // verify the token
    const {
      decryptedJWT: { payload },
      error: verifyError,
    } = await verifyJWT(token);
    if (verifyError) {
      clearTokens(res);
      throw new AppError(verifyError.message, StatusCodes.UNAUTHORIZED);
    }

    /**
     * if type is access token, we don't
     * check against redis and don't verify the user
     * the purpose of the access token is to be stateless and avoid
     * the need to check against the database
     * the token must contain the info needed to verify the user
     * email, role, id, strategy, etc.
     */
    if (type === 'refresh_token') {
      const { account, user } = await getAccountAndUserOrThrow({
        userId: payload.user,
        strategy: payload.strategy,
      });

      // TODO: logic for blacklist, ban, active,etc.

      // check if user still exists
      // and the account used to login is active (wasn't deleted)
      if (!user || !account?.active) {
        await invalidateAllSessionsForUser(
          sessionRedisConnection,
          payload.user
        );
        throw new AppError(
          'Unauthorized, please login again.',
          StatusCodes.FORBIDDEN
        );
      }
    }

    // at this point, we know the token is valid

    // eslint-disable-next-line no-magic-numbers
    if (restrictTo.length > 0 && !restrictTo.includes(payload.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        StatusCodes.FORBIDDEN
      );
    }

    // this middleware is only used to protect routes
    // and provide some info about the user
    // it doesn't fetch the user from the database or it makes the access
    // token strategy pointless

    // eslint-disable-next-line require-atomic-updates
    req.tokenPayload = payload;

    next();
  });

/**
 * Middleware to set the user on the request object
 * using the token payload info
 *
 * this way we can split the logic of verifying the token
 * and fetching the user from the database
 */
export const setUserAndAccountOnRequest = catchAsync(async (req, _, next) => {
  const { tokenPayload } = req;
  if (!tokenPayload) {
    throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
  }

  const { user, account } = await getAccountAndUserOrThrow({
    userId: tokenPayload.user,
    strategy: tokenPayload.strategy,
  });

  // eslint-disable-next-line require-atomic-updates
  req.user = user;
  // eslint-disable-next-line require-atomic-updates
  req.account = account;

  next();
});

interface IGetAuthTokenFromCookieOrHeader {
  /**
   * if provided, only the token from the cookie or header will be checked
   */
  only?: 'cookie' | 'header';
  /**
   * The priority of the token if both are present.
   * default is cookie
   */
  priority?: 'cookie' | 'header';
  request: Request;
  type: 'access_token' | 'refresh_token';
}

/**
 * The function accepts an object as a parameter, which includes properties `token`, `bearer`, `priority`, and `only`.
 * The `token` and `bearer` are the actual authentication tokens that could be found in a cookie or a header respectively.
 * The `priority` is a string that determines which source to prioritize when extracting the token, defaulting to 'cookie'.
 *
 * The `only` property is used to prevent throwing an error when no token is found in the cookie or header.
 *
 * The function returns an object with two properties: `token` and `error`.
 * The `token` is the extracted authentication token, and `error` is an instance of `Error` or `null`, indicating whether an error occurred during the extraction process.
 *
 * The function first checks if both `token` and `bearer` are not provided and `only` is not set.
 * If so, it returns an object with an empty string for `token` and an `Error` instance for `error`, indicating that no refresh token was found.
 *
 * The function then declares a variable `tokenValue` to hold the extracted token.
 *
 * Next, the function checks the `priority`. If the `priority` is 'cookie' and `token` is provided, it assigns the `token` to `tokenValue`.
 * If `token` is not provided but `bearer` is, it splits the `bearer` into `type` and `value`.
 * If the `type` is not 'Bearer', it returns an error. Otherwise, it assigns the `value` to `tokenValue`.
 *
 * If the `priority` is not 'cookie', it checks if `bearer` is provided.
 * If so, it performs the same splitting and checking process as above.
 * If `bearer` is not provided but `token` is, it assigns the `token` to `tokenValue`.
 *
 * Finally, the function returns an object with `tokenValue` as `token` and `null` as `error`, indicating that the token extraction was successful.
 *
 */
export const getAuthTokenFromCookieOrHeader = ({
  request,
  type,
  priority = 'cookie',
  only,
}: IGetAuthTokenFromCookieOrHeader): {
  error: Error | null;
  token: string;
} => {
  // TODO: clean up the function
  let token = '';

  let bearer = '';

  if (type === 'access_token') {
    const { access_token } = request.cookies as {
      access_token: string | undefined;
    }; // cookies strategy

    const { authorization } = request.headers; // bearer token strategy

    token = access_token ?? '';

    bearer = authorization ?? '';
  } else {
    const { refresh_token } = request.cookies as {
      refresh_token: string | undefined;
    }; // cookies strategy

    const { authorization } = request.headers; // bearer token strategy

    token = refresh_token ?? '';

    bearer = authorization ?? '';
  }

  if (!only && !token && !bearer) {
    return { token: '', error: new Error(`No ${type} token found`) };
  }

  let tokenValue = '';

  // assign the token based on the priority with overriding
  if (priority === 'cookie' && token) {
    if (token) {
      tokenValue = token;
    } else if (bearer) {
      const [type, value] = bearer.split(' ');

      if (type !== 'Bearer') {
        return { token: '', error: new Error('Invalid token type in cookie') };
      }

      tokenValue = value;
    }
  } else {
    if (bearer) {
      const [type, value] = bearer.split(' ');

      if (type !== 'Bearer') {
        return { token: '', error: new Error('Invalid bearer token type') };
      }

      tokenValue = value;
    } else if (token) {
      tokenValue = token;
    }
  }

  return {
    token: tokenValue,
    error: null,
  };
};
