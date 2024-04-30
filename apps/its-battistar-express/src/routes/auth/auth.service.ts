import { IUser } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';

import { verifyJWT } from '../../utils';
import { AppError } from '../../utils/app-error';
import { catchAsync } from '../../utils/catch-async';
import { UserModel } from '../api/users/users.model';

interface IProtectRouteOptions {
  /**
   * Array of roles that are allowed to access the route.
   * Default is empty array, which means all roles are allowed.
   */
  restrictTo?: IUser['role'][];
  allowJWT?: boolean;
  allowBearerToken?: boolean;
}

type TProtectRoute = (
  options?: IProtectRouteOptions
) => ReturnType<typeof catchAsync>;

/**
 * Authenticate user and check if user is logged in
 * Restrict access to certain roles if param restrictTo is provided
 */
export const protectRoute: TProtectRoute = (
  { restrictTo = [] } = {
    restrictTo: [],
  }
) =>
  catchAsync(async (req, _, next) => {
    // STEP 1: Verify the jwt with jose
    // STEP 2: Check if user still exists
    // STEP 3: Find the strategy used to login from token
    // STEP 4: Check if user is active
    // STEP 4b: Check if user is not banned or has the role
    // STEP 5: Find the user from the database and add it to the request object

    const { accessToken } = req.cookies as { accessToken: string | undefined }; // cookies strategy
    const { authorization } = req.headers; // bearer token strategy

    // TODO: repeating this in refresh handler, move to a middleware
    if (!accessToken && !authorization) {
      throw new AppError('No token provided', StatusCodes.UNAUTHORIZED);
    }

    // FIXME: repeating many things between refresh, protect, login, signup handlers
    // split the logic into a middleware or service or factory function
    let token = '';

    if (accessToken) {
      token = accessToken;
    } else if (authorization) {
      const [type, value] = authorization.split(' ');

      if (type !== 'Bearer') {
        throw new AppError('Invalid token type', StatusCodes.UNAUTHORIZED);
      }

      token = value;
    }

    // verify the token
    const {
      payload: { user },
    } = await verifyJWT(token);

    const foundUser = await UserModel.findOne({ _id: user });

    if (!foundUser) {
      throw new AppError('Not authorized', StatusCodes.UNAUTHORIZED);
    }

    // TODO: logic for blacklist, ban, active,etc.

    // eslint-disable-next-line no-magic-numbers
    if (restrictTo.length > 0 && !restrictTo.includes(foundUser.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        StatusCodes.FORBIDDEN
      );
    }

    next();
  });
