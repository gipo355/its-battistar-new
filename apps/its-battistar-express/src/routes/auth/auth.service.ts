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
    const { jwt } = req.cookies as { jwt: string | undefined };

    if (!jwt) {
      throw new AppError('You are not logged in', StatusCodes.UNAUTHORIZED);
    }

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
