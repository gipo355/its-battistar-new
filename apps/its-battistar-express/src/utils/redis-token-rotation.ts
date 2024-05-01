import type IORedis from 'ioredis';
import mongoose from 'mongoose';

import { APP_CONFIG as c } from '../app.config';

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
  payload: Record<string, unknown>;
  /**
   * The prefix of the redis key for the user key holding the refresh tokens list
   */
  prefix?: string;
}
export const rotateRefreshToken = async (
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
