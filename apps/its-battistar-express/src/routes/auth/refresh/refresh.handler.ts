import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APP_CONFIG as c } from '../../../app.config';
import { sessionRedisConnection } from '../../../db/redis';
import { AppError, catchAsync, verifyJWT } from '../../../utils';

// import { AppError } from '../../utils/app-error';
// import { catchAsync } from '../../utils/catch-async';

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
  console.log(payload); // { user: 'id'}

  // check if the token is whitelisted
  const item = await sessionRedisConnection.get(token);
  console.log(item); // user id

  const key = `${c.REDIS_USER_SESSION_PREFIX}${payload.user}`;
  const item2 = await sessionRedisConnection.smembers(key); // [token1, token2, ...]
  console.log(item2); // token

  // invalidate all sessions for the user if the token is not found
  if (!item) {
    await sessionRedisConnection.del(payload.user);
  }

  const data = {
    token: '1234567890',
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
