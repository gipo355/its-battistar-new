import express = require('express');

import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { appRouter } from './api/app.router';
import { NUMBER_OF_PROXIES } from './config';
import { prepareMongo } from './db/mongo';
import { environment } from './environment';
import { globalErrorHandler } from './errors/errors.handler';
import { errorsRouter } from './errors/errors.router';
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
    response.status(StatusCodes.OK).json({ status: 'ok', mongostate });
  });

  // dev only
  if (environment.NODE_ENV === 'development') {
    const swaggerUi = await import('swagger-ui-express');
    const { swaggerSpec } = await import('./docs/swagger');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info('📚 Swagger docs available at /api-docs');
  }

  // error handling
  app.use(errorsRouter);

  return app;
};
