import { CustomResponse } from '@its-battistar/shared-types';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError, catchAsync, verifyJWT } from '../../../utils';
import { UserModel } from '../../api/users/users.model';

/**
 * verify handler for email verification
 * and password reset
 */
export const verifyHandler: Handler = catchAsync(async (req, res) => {
  // ---- VERIFY EMAIL AND RESET PASSWORD ----
  // TODO: implement the logic for verifying email and reset password

  // ---- VERIFY LOGGED IN USER ----
  const { access_token } = req.cookies as { access_token: string | undefined };

  if (!access_token) {
    throw new AppError('No access token found', StatusCodes.UNAUTHORIZED);
  }

  const {
    decryptedJWT: {
      payload: { user: userID },
    },
  } = await verifyJWT(access_token);

  const user = await UserModel.findById(userID);

  const data = {
    user,
  };

  if (!user) {
    throw new AppError('Error verifying', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  // TODO: create the response schemas for serialization and sharing
  res.status(StatusCodes.OK).json(
    new CustomResponse<typeof data>({
      ok: true,
      statusCode: StatusCodes.OK,
      data,
    })
  );
});
