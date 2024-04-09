import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');

import pino from 'pino-http';

import { apiRouter } from './api/routes';
import { corsOptions } from './config';
import { errorHandlers } from './errors';
import { logger } from './utils/logger';

export const buildApp = function () {
  logger.info('🏠 Building app...');
  const app = express();

  app.use(cors(corsOptions));
  app.use(pino());
  app.use(bodyParser.json());

  app.use('/api', apiRouter);

  app.use(errorHandlers);

  return app;
};
