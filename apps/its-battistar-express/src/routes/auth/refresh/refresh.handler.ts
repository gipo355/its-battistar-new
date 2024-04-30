import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APP_CONFIG as c } from '../../../app.config';
import { sessionRedisConnection } from '../../../db/redis';
import { AppError, catchAsync, createJWT, verifyJWT } from '../../../utils';
import { UserModel } from '../../api/users/users.model';

// import { AppError } from '../../utils/app-error';
// import { catchAsync } from '../../utils/catch-async';

// TODO: make factory func for this to split the logic
export const refreshHandler: Handler = catchAsync(async (req, res) => {
  /**
   * steps:
   * 1. check if there is a refresh token in the cookie or header
   * 2. decrypt and verify the token
   * 3. verify if refresh token is whitelisted in redis
   * 3b. if not, check if it has a user ID in the payload.
   * 3c. if it has a user ID, disconnect all sessions for that user since a not whitelist token was used
   *
   * remove the refresh token from the whitelist in redis, both key and user ID key
   *
   * add the refresh token to the whitelist in redis both
   */

  const { refreshToken } = req.cookies as { refreshToken: string | undefined };
  const { Authorization } = req.headers as {
    Authorization: string | undefined;
  };

  if (!refreshToken && !Authorization) {
    throw new AppError('No refresh token found', StatusCodes.UNAUTHORIZED);
  }

  let token = '';

  // get the token
  if (refreshToken) {
    token = refreshToken;
  } else if (Authorization) {
    const [type, value] = Authorization.split(' ');

    if (type !== 'Bearer') {
      throw new AppError('Invalid token type', StatusCodes.UNAUTHORIZED);
    }

    token = value;
  }

  // verify the token
  const { payload } = await verifyJWT(token);

  /**
   * here we could check if same user agent and ip is used for the session
   */
  // saving individual token as key is used to save info about the session
  // like IP, user agent, etc.
  // check if the token is whitelisted
  // const item = await sessionRedisConnection.get(token);

  // get all the tokens for the user
  const key = `${c.REDIS_USER_SESSION_PREFIX}${payload.user}`;
  const item2 = await sessionRedisConnection.smembers(key); // [token1, token2, ...]

  // invalidate all sessions for the user if the token is not found
  if (!item2.includes(token)) {
    await sessionRedisConnection.del(key);
    throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
  }

  // TODO: refactor to abstract logics, make an exist method in the service
  // check if user exists
  const user = await UserModel.findById(payload.user);
  if (!user) {
    await sessionRedisConnection.del(key);
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  // rotate the refresh, create new access
  const newAccessToken = await createJWT({
    data: {
      user: user._id.toString(),
      strategy: 'LOCAL',
    },
    type: 'access',
  });

  const newRefreshToken = await createJWT({
    data: {
      user: user._id.toString(),
      strategy: 'LOCAL',
    },
    type: 'refresh',
  });

  await sessionRedisConnection.del(token);
  await sessionRedisConnection.srem(key, token);
  await sessionRedisConnection.sadd(key, newRefreshToken);

  const data = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };

  res.cookie('accessToken', newAccessToken, c.JWT_ACCESS_COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, c.JWT_REFRESH_COOKIE_OPTIONS);

  res.status(StatusCodes.OK).json(
    new CustomResponse<typeof data>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Refreshed token successfully',
      data,
    })
  );
});
