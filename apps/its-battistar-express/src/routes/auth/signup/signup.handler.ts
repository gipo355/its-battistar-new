import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APP_CONFIG as c } from '../../../app.config';
import { AppError, catchAsync, createJWT } from '../../../utils';
import { UserModel } from '../../api/users/users.model';

export const signupHandler: Handler = catchAsync(async (req, res) => {
  const { email, password, passwordConfirm } = req.body as {
    email: string | undefined;
    password: string | undefined;
    passwordConfirm: string | undefined;
  };

  // validate email and password in mongoose schema or ajv
  if (!email || !password || !passwordConfirm) {
    throw new AppError(
      'Email and password are required',
      StatusCodes.BAD_REQUEST
    );
  }

  /**
   * do an upsert if a local account does not exist
   */
  const user = await UserModel.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        accounts: [
          {
            strategy: 'LOCAL',
            password,
            passwordConfirm,
          },
        ],
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  const jwtPayload = await createJWT({
    user: user._id.toString(),
    strategy: 'LOCAL',
  });

  res.cookie('jwt', jwtPayload, c.JWT_ACCESS_COOKIE_OPTIONS);

  res.status(StatusCodes.OK).json(
    new CustomResponse<{
      jwt: string;
    }>({
      ok: true,
      statusCode: StatusCodes.CREATED,
      message: 'Registered successfully',
      data: {
        jwt: jwtPayload,
      },
    })
  );
});
