import express = require('express');

import mongoose from 'mongoose';

import { apiRouter } from './api/routes';
import { errorHandlers } from './errors';
import { prepareMongo } from './mongo/mongoose';
import { logger } from './utils/logger';

export const buildApp = async function () {
  logger.info('🏠 Building app...');
  const app = express();

  await prepareMongo();

  app.get('/healthz', (_, response) => {
    const mongostate = mongoose.connection.readyState;
    response.status(200).json({ status: 'ok', mongostate });
  });

  app.use('/api', apiRouter);

  app.use(errorHandlers);

  return app;
};
