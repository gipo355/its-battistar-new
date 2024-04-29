import { IUser } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';

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
  options: IProtectRouteOptions
) => ReturnType<typeof catchAsync>;

/**
 * Authenticate user and check if user is logged in
 * Restrict access to certain roles if param restrictTo is provided
 */
export const protectRoute: TProtectRoute = ({ restrictTo = [] }) =>
  catchAsync(async (req, _, next) => {
    // TODO: implement auth logic after implementing auth service
    const { jwt } = req.cookies as { jwt: string | undefined }; // cookies strategy
    const bearerToken = req.headers.authorization; // bearer token strategy

    if (!jwt && !bearerToken) {
      throw new AppError('You are not logged in', StatusCodes.UNAUTHORIZED);
    }

    // must add connect-redis redis
    // check fastify implementation
    // access refresh tokens, refresh in redis session

    // STEP 1: Verify the jwt with jose
    // STEP 2: Check if user still exists
    // STEP 3: Find the strategy used to login from token
    // STEP 4: Check if user is active
    // STEP 5: Find the user from the database and add it to the request object

    const foundUser = await UserModel.findOne({ jwt });

    if (!foundUser) {
      throw new AppError('User not found', StatusCodes.UNAUTHORIZED);
    }

    // eslint-disable-next-line no-magic-numbers
    if (restrictTo.length > 0 && !restrictTo.includes(foundUser.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        StatusCodes.FORBIDDEN
      );
    }

    next();
  });

protectRoute({
  restrictTo: ['SUPER', 'USER'],
});
