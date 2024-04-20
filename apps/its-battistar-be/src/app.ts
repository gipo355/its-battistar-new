import express = require('express');

import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { appRouter } from './api/app.router';
import { appMiddleware } from './app.middleware';
import { errorHandlers } from './errors';
import { prepareMongo } from './mongo/mongoose';
import { logger } from './utils/logger';

export const buildApp = async function () {
  logger.info('🏠 Building app...');

  const app = express();

  await prepareMongo();

  app.use(appMiddleware);

  app.use('/api', appRouter);

  app.get('/healthz', (_, response) => {
    const mongostate = mongoose.connection.readyState;
    response.status(StatusCodes.OK).json({ status: 'ok', mongostate });
  });

  app.use(errorHandlers);

  return app;
};
