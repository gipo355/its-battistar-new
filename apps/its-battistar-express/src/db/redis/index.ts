import IORedis from 'ioredis';

import { e } from '../../environments';

const connection = {
  host: e.REDIS_HOST,
  password: e.REDIS_PASSWORD,
  port: Number(e.REDIS_PORT),
  username: e.REDIS_USERNAME,
  maxRetriesPerRequest: null,
};

export const redisConnection = new IORedis(connection);
