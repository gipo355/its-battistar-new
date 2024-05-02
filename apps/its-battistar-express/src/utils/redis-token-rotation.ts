import {
  ajvInstance,
  assertAjvValidationOrThrow,
} from '@its-battistar/shared-utils';
import { type Static, Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';
import type IORedis from 'ioredis';
import type mongoose from 'mongoose';

import { APP_CONFIG as c } from '../app.config';
import { AppError } from './app-error';

const redisSessionPayloadSchema = Type.Object({
  ip: Type.Optional(Type.String()),
  userAgent: Type.Optional(Type.String()),
  user: Type.Optional(Type.String()),
});
type TRedisSessionPayload = Static<typeof redisSessionPayloadSchema>;
const validateRedisSessionPayload = ajvInstance.compile(
  redisSessionPayloadSchema
);

interface IRotateRefreshToken {
  redisConnection: IORedis;
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
   * The user id or username
   */
  user: string | mongoose.Types.ObjectId;
  /**
   * The payload of the redis item to link to the new refresh token
   * Put ip, user agent, etc. here
   */
  payload: TRedisSessionPayload;
  /**
   * The prefix of the redis key for the user key holding the refresh tokens list
   */
  prefix?: string;
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
  const { redisConnection, newToken, oldToken, user, payload, prefix } = o;

  // set the key for the user's list of refresh tokens
  const key = `${prefix ?? ''}${user.toString()}`;

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

interface IValidateSessionRedis {
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
  /**
   * Check if the session IP is the same as the one used to create the session
   * if provided, the requestIP must be provided
   */
  checkSessionIP?: {
    /**
     * The IP address to check against
     */
    ip: string;
    /**
     * The error message to throw if the IP is different
     */
    errorMessage: string;
  };
  /**
   * Check if the session user agent is the same as the one used to create the session
   */
  checkSessionUA?: {
    /**
     * The user agent to check against
     */
    ua: string;
    /**
     * The error message to throw if the user agent is different
     */
    errorMessage: string;
  };
}
export const validateSessionRedis = async (
  o: IValidateSessionRedis
): Promise<Error | null> => {
  const { redisConnection, token, user, checkSessionIP, checkSessionUA } = o;

  // get all the sessions tokens active for the user
  const userSessionsKey = `${c.REDIS_USER_SESSION_PREFIX}${user.toString()}`;
  const redisSessionsList = await redisConnection.smembers(userSessionsKey); // [token1, token2, ...]
  // invalidate all sessions for the user if the token is not found (whitelist check)
  if (!redisSessionsList.includes(token)) {
    await redisConnection.del(userSessionsKey);
    return new Error('Invalid token used, all sessions invalidated');
  }

  // if we have to check the IP and user agent, get the token payload
  if (!checkSessionIP && !checkSessionUA) {
    return null;
  }
  // verify the token payload is in redis
  const t = await redisConnection.get(token);
  if (!t) {
    // delete the key
    await redisConnection.del(userSessionsKey);
    // remove it from the list
    await redisConnection.srem(userSessionsKey, token);

    return new Error('Invalid token used, session not found in redis');
  }
  // const tokenRedisPayload: IRedisSessionPayload = JSON.parse(t);
  const tokenRedisPayload = JSON.parse(t);
  assertAjvValidationOrThrow<TRedisSessionPayload>(
    tokenRedisPayload,
    validateRedisSessionPayload,
    new AppError('Invalid token payload', StatusCodes.BAD_REQUEST)
  );

  if (checkSessionIP) {
    if (tokenRedisPayload.ip !== checkSessionIP.ip) {
      return new Error(checkSessionIP.errorMessage);
    }
  }

  if (checkSessionUA) {
    if (tokenRedisPayload.userAgent !== checkSessionUA.ua) {
      return new Error(checkSessionUA.errorMessage);
    }
  }

  return null;
};
