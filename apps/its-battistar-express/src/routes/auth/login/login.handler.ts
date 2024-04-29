import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError, catchAsync, createJWT } from '../../../utils';
import { AccountModel } from '../../api/users/accounts.model';
import { UserModel } from '../../api/users/users.model';

export const loginHandler: Handler = catchAsync(async (req, res) => {
  const { email, password } = req.body as {
    email: string | undefined;
    password: string | undefined;
  };

  // TODO: validate email and password in mongoose schema or ajv
  if (!email || !password) {
    throw new AppError(
      'Email and password are required',
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await UserModel.findOne({
    email,
    accounts: {
      $elemMatch: {
        strategy: 'LOCAL',
      },
    },
  });

  console.log('user', user);

  // VULNERABILITY: timing attack
  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  // compare hashed password with user's password
  const userAccount = await AccountModel.findOne({
    user: user._id,
    strategy: 'LOCAL',
  });

  if (!userAccount) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const isValid = await userAccount.comparePassword(password);

  if (!isValid) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const accessToken = await createJWT({
    data: {
      user: user._id.toString(),
      strategy: 'LOCAL',
    },
    type: 'access',
  });

  const refreshToken = await createJWT({
    data: {
      user: user._id.toString(),
      strategy: 'LOCAL',
    },
    type: 'refresh',
  });

  res.status(StatusCodes.OK).json(
    new CustomResponse<{
      accessToken: string;
      refreshToken: string;
    }>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Logged in successfully',
      data: {
        accessToken,
        refreshToken,
      },
    })
  );
});
