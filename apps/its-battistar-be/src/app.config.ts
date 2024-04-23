import { redisConnection } from './db/redis';
import { e } from './environments';

export const API_VERSION = 'v1';

export const corsOptions = {};

export const helmetOptions = {};

// rate limiting
export const rateLimiterOptions = {
  storeClient: redisConnection,
  points: +e.RATE_LIMITER_POINTS, // Number of points
  duration: +e.RATE_LIMITER_DURATION, // Per second(s)
  keyPrefix: 'rateLimiter',

  // Custom
  execEvenly: false, // Do not delay actions evenly
  // blockDuration: 0, // Do not block if consumed more than points
};
