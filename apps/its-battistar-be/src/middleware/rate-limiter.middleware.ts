import type { NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { RATE_LIMITER_DURATION, RATE_LIMITER_POINTS } from '../config';
import { redisConnection } from '../db/redis';
import { AppError } from '../utils/app-error';
import { catchAsync } from '../utils/catch-async';

const options = {
  storeClient: redisConnection,
  points: RATE_LIMITER_POINTS, // Number of points
  duration: RATE_LIMITER_DURATION, // Per second(s)
  keyPrefix: 'rateLimiter',

  // Custom
  execEvenly: false, // Do not delay actions evenly
  // blockDuration: 0, // Do not block if consumed more than points
};

const rateLimiterRedis = new RateLimiterRedis(options);

const rateLimiterMiddleware = catchAsync(
  async (request: Request, _, next: NextFunction) => {
    try {
      if (request.ip) {
        await rateLimiterRedis.consume(request.ip);
      }
      next();
    } catch {
      next(
        new AppError(
          'Too Many Requests, try again in one hour!',
          StatusCodes.TOO_MANY_REQUESTS
        )
      );
    }
  }
);

export { rateLimiterMiddleware };
