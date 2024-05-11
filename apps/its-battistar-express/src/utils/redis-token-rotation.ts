import type { TRedisSessionPayload } from '@its-battistar/shared-types';
import {
  assertAjvValidationOrThrow,
  validateRedisSessionPayload,
} from '@its-battistar/shared-utils';
import { StatusCodes } from 'http-status-codes';
import type IORedis from 'ioredis';
import type mongoose from 'mongoose';

import { APP_CONFIG as c } from '../app.config';
import { AppError } from './app-error';

export const generateSessionUserKey = (
  user: string | mongoose.Types.ObjectId
): string => `${c.REDIS_USER_SESSION_PREFIX}${user.toString()}`;

interface IRotateRefreshToken {
  /**
   * The new refresh token to be rotated in
   */
  newToken: string;
  /**
   * The old refresh token to be rotated out
   * if not provided, the function will not delete the old token
   */
  oldToken?: string;
  /**
   * The payload of the redis item to link to the new refresh token
   * Put ip, user agent, etc. here
   */
  payload: TRedisSessionPayload;
  redisConnection: IORedis;
  /**
   * The user id or username
   */
  user: string | mongoose.Types.ObjectId;
}
/**
 * set up the whitelist for the refresh token, add it as a key to the redis store
 * this will allow us to revoke the refresh token and check quickly if it is valid during refresh
 * we need to store the id of the user to be able to revoke all the refresh tokens associated with the user in case
 * a an invalid refresh token is used
 */
export const rotateRefreshTokenRedis = async (
  o: IRotateRefreshToken
): Promise<void> => {
  const { redisConnection, newToken, oldToken, user, payload } = o;

  // set the key for the user's list of refresh tokens
  const key = generateSessionUserKey(user);

  if (oldToken) {
    // delete the old token
    await redisConnection.del(oldToken);
    // remove the old token from the user's list of refresh tokens
    await redisConnection.srem(key, oldToken);
  }

  // set the new token with the payload
  await redisConnection.set(
    newToken,
    JSON.stringify(payload),
    'EX',
    c.JWT_REFRESH_TOKEN_OPTIONS.expSeconds
  );

  /**
   * add it to a list of refresh tokens for the user to be able to revoke it
   * where the key is the user id and the values are the refresh tokens issued and valid
   */
  await redisConnection.sadd(key, newToken);
  // reset the expiration time for the user sessions
  await redisConnection.expire(key, c.REDIS_USER_SESSION_MAX_EX);
};

export const invalidateAllSessionsForUser = async (
  redisConnection: IORedis,
  user: string | mongoose.Types.ObjectId
): Promise<string> => {
  const key = generateSessionUserKey(user);
  await redisConnection.del(key);
  return key;
};

interface IValidateSessionRedis {
  /**
   * Check if the session IP is the same as the one used to create the session
   * if provided, the requestIP must be provided
   */
  checkSessionIP?: {
    /**
     * The error message to throw if the IP is different
     */
    errorMessage: string;
    /**
     * The IP address to check against
     */
    ip: string;
  };
  /**
   * Check if the session user agent is the same as the one used to create the session
   */
  checkSessionUA?: {
    /**
     * The error message to throw if the user agent is different
     */
    errorMessage: string;
    /**
     * The user agent to check against
     */
    ua: string;
  };
  redisConnection: IORedis;
  /**
   * The refresh token to be checked in the redis store
   */
  token: string;
  /**
   * The user id
   * usually the id extracted from the payload of the refresh token
   */
  user: string | mongoose.Types.ObjectId;
}
/**
 * Validate the session token in redis
 *
 * The function begins by destructuring the input object to extract the `redisConnection`, `token`, `user`, `checkSessionIP`, and `checkSessionUA` properties.
 * The `redisConnection` is used to interact with the Redis database, `token` is the session token to be validated,
 * `user` is the user associated with the session,
 * and `checkSessionIP` and `checkSessionUA` are optional checks for the IP address and user agent, respectively.
*
* The function then retrieves all active session tokens for the user from the Redis database.
* If the provided token is not found in this list, all sessions for the user are invalidated and an error is returned.
*
* If the token is found, and if either `checkSessionIP` or `checkSessionUA` is true, the function retrieves the payload of the token from Redis.
* If the token payload is not found in Redis, the token is removed from the user's session list and an error is returned.
*
* The token payload is then parsed from JSON and validated using the `assertAjvValidationOrThrow` function. If the payload is invalid, an error is thrown.
*
* If the `checkSessionIP` property is true, the function checks if the IP address in the token payload matches the IP address provided in the `checkSessionIP` object.
* If they do not match, an error is returned with the message from `checkSessionIP.errorMessage` and invalidates all user sessions as attempted login with stolen token.
*
* Similarly, if the `checkSessionUA` property is true, the function checks if the user agent in the token payload matches the user agent provided in the `checkSessionUA` object.
* If they do not match, an error is returned with the message from `checkSessionUA.errorMessage` and invalidates all user sessions as attempted login with stolen token.
*
* If all checks pass, the function returns null, indicating that the session token is valid.

 */
export const validateSessionRedis = async (
  o: IValidateSessionRedis
): Promise<Error | null> => {
  const { redisConnection, token, user, checkSessionIP, checkSessionUA } = o;

  // get all the sessions tokens active for the user
  const userSessionsKey = generateSessionUserKey(user);
  const redisSessionsList = await redisConnection.smembers(userSessionsKey); // [token1, token2, ...]
  // invalidate all sessions for the user if the token is not found (whitelist check)
  if (!redisSessionsList.includes(token)) {
    await invalidateAllSessionsForUser(redisConnection, user);
    return new Error('Invalid token used, all sessions invalidated');
  }

  // if we have to check the IP and user agent, get the token payload
  if (!checkSessionIP && !checkSessionUA) {
    return null;
  }
  // verify the token payload is in redis
  const t = await redisConnection.get(token);
  if (!t) {
    // remove it from the list of sessions for the user
    await redisConnection.srem(userSessionsKey, token);

    return new Error('Invalid token used, session not found in redis');
  }

  // const tokenRedisPayload: IRedisSessionPayload = JSON.parse(t);
  const tokenRedisPayload = JSON.parse(t);
  assertAjvValidationOrThrow<TRedisSessionPayload>(
    tokenRedisPayload,
    validateRedisSessionPayload,
    (errors) => {
      let messages = '';
      if (errors)
        for (const error of errors) {
          if (typeof error.message === 'string')
            messages += error.message + '\n';
        }
      new AppError(messages, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  );

  if (checkSessionIP) {
    if (tokenRedisPayload.ip !== checkSessionIP.ip) {
      await invalidateAllSessionsForUser(redisConnection, user);
      return new Error(checkSessionIP.errorMessage);
    }
  }

  if (checkSessionUA) {
    if (tokenRedisPayload.userAgent !== checkSessionUA.ua) {
      await invalidateAllSessionsForUser(redisConnection, user);
      return new Error(checkSessionUA.errorMessage);
    }
  }

  return null;
};
