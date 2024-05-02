import express = require('express');

import { CustomResponse } from '@its-battistar/shared-types';
import type { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { appRouter } from './app.router';
import { appMiddleware } from './app.service';
import { prepareMongo } from './db/mongo';
import { rateLimitRedisConnection } from './db/redis';
import { e } from './environments';
import { finalErrorHandler } from './errors/errors.handler';
import { preErrorsRouter } from './errors/pre-errors.router';
import { logger } from './utils/logger';

export const buildApp = async function (): Promise<Express> {
  logger.info('🏠 Building app...');

  const app = express();

  // prevents fingerprint
  app.disable('x-powered-by');
  // allow caddy/nginx to handle proxy headers
  app.set('trust proxy', Number(e.EXPRESS_TRUST_NUMBER_OF_PROXIES));

  await prepareMongo();

  app.use(appMiddleware);

  app.use(appRouter);

  app.get('/healthz', (_, response) => {
    const mongostate = mongoose.connection.readyState;
    const redisstate = rateLimitRedisConnection.status;

    response.status(StatusCodes.OK).json(
      new CustomResponse<{
        mongostate: number;
        redisstate: string;
      }>({
        ok: true,
        statusCode: StatusCodes.OK,
        message: 'Healthy',
        data: {
          mongostate,
          redisstate,
        },
      })
    );
  });

  logger.info(`🍀 Environment: ${e.NODE_ENV}`);
  // dev only
  if (e.NODE_ENV === 'development') {
    const swaggerUi = await import('swagger-ui-express');
    const { swaggerSpec } = await import('./docs/swagger');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info('📚 Swagger docs available at /api-docs');
  }

  // error handling
  // app.use(
  //   (
  //     err: Error,
  //     req: express.Request,
  //     res: express.Response,
  //     next: express.NextFunction
  //   ) => {
  //     console.log(err, req.path, next);
  //     logger.error(err);
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //       status: 'error',
  //       message: 'Something went wrong',
  //     });
  //   }
  // );

  app.use(preErrorsRouter);

  /**
   * ## IMP: Error handling
   *
   * Global error handler, gets passed the error object from all previous middlewares after every route is checked
   * Lifecycle ends here
   *
   * Can't be put inside a router or it won't catch errors
   */
  app.use([finalErrorHandler]);

  return app;
};
