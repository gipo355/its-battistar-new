import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APP_CONFIG as c } from '../../../app.config';
import { sessionRedisConnection } from '../../../db/redis';
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
    // accounts: {
    //   $elemMatch: {
    //     strategy: 'LOCAL',
    //   },
    // },
  });

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

  // TODO: move to util fn
  /**
   * set up the whitelist for the refresh token, add it as a key to the redis store
   * this will allow us to revoke the refresh token and check quickly if it is valid during refresh
   * we need to store the id of the user to be able to revoke all the refresh tokens associated with the user in case
   * a an invalid refresh token is used
   */
  await sessionRedisConnection.set(
    refreshToken,
    user._id.toString(),
    'EX', // FIXME, fix EX, its set to 19years now
    c.JWT_REFRESH_TOKEN_OPTIONS.expMilliseconds
  );
  /**
   * add it to a list of refresh tokens for the user to be able to revoke it
   * where the key is the user id and the values are the refresh tokens issued and valid
   */
  await sessionRedisConnection.sadd(user._id.toString(), refreshToken);

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
