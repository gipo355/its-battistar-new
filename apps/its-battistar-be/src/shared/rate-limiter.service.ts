import type { NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { AppError } from '../utils/app-error';
import { catchAsync } from '../utils/catch-async';
import { rateLimiterOptions } from '../app.config';

const rateLimiterRedis = new RateLimiterRedis(rateLimiterOptions);

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
