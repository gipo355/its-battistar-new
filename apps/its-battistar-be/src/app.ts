import express = require('express');

import { CustomResponse } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { appRouter } from './api/app.router';
import { NUMBER_OF_PROXIES } from './config';
import { prepareMongo } from './db/mongo';
import { redisConnection } from './db/redis';
import { environment } from './environment';
import { errorsHandler } from './errors/errors.handler';
import { preErrorsRouter } from './errors/pre-errors.router';
import { appMiddleware } from './middleware/app.middleware';
import { logger } from './utils/logger';

export const buildApp = async function () {
  logger.info('🏠 Building app...');

  const app = express();

  // prevents fingerprint
  app.disable('x-powered-by');
  // allow caddy/nginx to handle proxy headers
  app.set('trust proxy', NUMBER_OF_PROXIES);

  await prepareMongo();

  app.use(appMiddleware);

  app.use('/api', appRouter);

  app.get('/healthz', (_, response) => {
    const mongostate = mongoose.connection.readyState;
    const redisstate = redisConnection.status;

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

  logger.info(`🍀 Environment: ${environment.NODE_ENV}`);
  // dev only
  if (environment.NODE_ENV === 'development') {
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
  app.use([errorsHandler]);

  return app;
};
