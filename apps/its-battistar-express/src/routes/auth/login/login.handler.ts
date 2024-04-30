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

  res.cookie('accessToken', accessToken, c.JWT_ACCESS_COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, c.JWT_REFRESH_COOKIE_OPTIONS);

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
    'EX',
    c.JWT_REFRESH_TOKEN_OPTIONS.expSeconds
  );
  /**
   * add it to a list of refresh tokens for the user to be able to revoke it
   * where the key is the user id and the values are the refresh tokens issued and valid
   * thus consisting of all the "sessions" the user has active
   */
  const key = `${c.REDIS_USER_SESSION_PREFIX}${user._id.toString()}`;
  await sessionRedisConnection.sadd(key, refreshToken);
  // reset the expiration time for the user sessions
  // we must have both the token key and user key with token value for token to be valid
  await sessionRedisConnection.expire(key, c.REDIS_USER_SESSION_MAX_EX);

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
