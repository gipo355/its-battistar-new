import { CustomResponse } from '@its-battistar/shared-types';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APP_CONFIG as c } from '../../../app.config';
import { sessionRedisConnection } from '../../../db/redis';
import {
  AppError,
  catchAsync,
  createJWT,
  generateTokens,
  invalidateAllSessionsForUser,
  rotateRefreshTokenRedis,
  validateSessionRedis,
  verifyJWT,
} from '../../../utils';
import { UserModel } from '../../api/users/users.model';
import { getAuthTokenFromCookieOrHeader } from './refresh.service';

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
  const { authorization } = req.headers as {
    authorization: string | undefined;
  };
  //
  // if (!refreshToken && !authorization) {
  //   throw new AppError('No refresh token found', StatusCodes.UNAUTHORIZED);
  // }

  // let token = '';
  //
  // // get the token
  // if (refreshToken) {
  //   token = refreshToken;
  // } else if (authorization) {
  //   const [type, value] = authorization.split(' ');
  //
  //   if (type !== 'Bearer') {
  //     throw new AppError('Invalid token type', StatusCodes.UNAUTHORIZED);
  //   }
  //
  //   token = value;
  // }

  const { token, error } = getAuthTokenFromCookieOrHeader({
    token: refreshToken,
    bearer: authorization,
  });
  if (error) {
    throw new AppError(error.message, StatusCodes.UNAUTHORIZED);
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
  // const key = `${c.REDIS_USER_SESSION_PREFIX}${payload.user}`;
  // const item2 = await sessionRedisConnection.smembers(key); // [token1, token2, ...]
  //
  // // invalidate all sessions for the user if the token is not found
  // if (!item2.includes(token)) {
  //   await sessionRedisConnection.del(key);
  //   throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
  // }
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  await validateSessionRedis({
    redisConnection: sessionRedisConnection,
    token,
    user: payload.user,
    ...(ip && {
      checkSessionIP: {
        ip,
        errorMessage: 'Invalid IP address used',
      },
    }),
    ...(userAgent && {
      checkSessionUA: {
        ua: userAgent,
        errorMessage: 'Invalid User Agent used',
      },
    }),
  });

  // TODO: should validation be done for user or account?

  // check if user exists
  const user = await UserModel.findById(payload.user);
  if (!user) {
    await invalidateAllSessionsForUser(sessionRedisConnection, payload.user);
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateTokens({
      setCookiesOn: res,
      payload: {
        user: user._id.toString(),
        strategy: payload.strategy,
      },
    });
  if (!newAccessToken || !newRefreshToken) {
    throw new AppError(
      'Could not generate tokens',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  await rotateRefreshTokenRedis({
    redisConnection: sessionRedisConnection,
    oldToken: token,
    newToken: newRefreshToken,
    user: user._id.toString(),
    payload: {
      user: user._id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    },
  });

  const data = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
  res.status(StatusCodes.OK).json(
    new CustomResponse<typeof data>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Refreshed token successfully',
      data,
    })
  );
});
