import type { NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { APP_CONFIG as c } from '../app.config';
import { AppError } from '../utils/app-error';
import { catchAsync } from '../utils/catch-async';

const rateLimiterRedis = new RateLimiterRedis(c.rateLimiterOptions);

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
