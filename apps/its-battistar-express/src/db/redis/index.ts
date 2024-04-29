import IORedis from 'ioredis';

import { e } from '../../environments';

const connection = {
  host: e.REDIS_HOST,
  password: e.REDIS_PASSWORD,
  port: Number(e.REDIS_PORT),
  username: e.REDIS_USERNAME,
  maxRetriesPerRequest: null,
};

export const rateLimitRedisConnection = new IORedis(connection);

export const sessionRedisConnection = new IORedis(connection);
