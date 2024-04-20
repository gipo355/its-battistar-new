import express = require('express');

import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { appRouter } from './api/app.router';
import { appMiddleware } from './app.middleware';
import { NUMBER_OF_PROXIES } from './config';
import { prepareMongo } from './db/mongo';
import { errorHandlers } from './errors';
import { logger } from './utils/logger';

export const buildApp = async function () {
  logger.info('🏠 Building app...');

  const app = express();

  // prevents fingerprint
  app.disable('x-powered-by');
  app.set('trust proxy', NUMBER_OF_PROXIES);

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
