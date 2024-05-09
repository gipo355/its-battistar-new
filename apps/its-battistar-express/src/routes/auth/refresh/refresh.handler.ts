import { CustomResponse } from '@its-battistar/shared-types';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { sessionRedisConnection } from '../../../db/redis';
import {
  AppError,
  catchAsync,
  clearTokens,
  generateTokens,
  invalidateAllSessionsForUser,
  rotateRefreshTokenRedis,
  validateSessionRedis,
  verifyJWT,
} from '../../../utils';
import { AccountModel } from '../../api/users/accounts.model';
import { UserModel } from '../../api/users/users.model';
import { getAuthTokenFromCookieOrHeader } from '../auth.service';

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

  const { token, error } = getAuthTokenFromCookieOrHeader({
    request: req,
    type: 'refresh_token',
  });
  if (error) {
    throw new AppError(error.message, StatusCodes.UNAUTHORIZED);
  }

  // verify the token
  const {
    decryptedJWT: { payload },
    error: verifyError,
  } = await verifyJWT(token);
  if (verifyError) {
    clearTokens(res);
    throw new AppError(verifyError.message, StatusCodes.UNAUTHORIZED);
  }

  /**
   * here we could check if same user agent and ip is used for the session
   */

  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  const redisError = await validateSessionRedis({
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
  if (redisError) {
    clearTokens(res);
    throw new AppError(redisError.message, StatusCodes.UNAUTHORIZED);
  }

  // TODO: should validation be done for user or account?

  // check if user exists
  const user = await UserModel.findById(payload.user);
  const account = await AccountModel.findOne({
    user: payload.user,
    strategy: payload.strategy,
  });

  if (!user || !account) {
    clearTokens(res);
    await invalidateAllSessionsForUser(sessionRedisConnection, payload.user);
    throw new AppError('Invalid token, reported', StatusCodes.BAD_REQUEST);
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateTokens({
      setCookiesOn: res,
      payload: {
        user: user._id.toString(),
        role: user.role,
        strategy: payload.strategy,
        account: account._id.toString(),
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
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
    user,
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
