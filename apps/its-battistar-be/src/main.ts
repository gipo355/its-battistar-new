import 'tslib'; // required for compilation since we are using typescript with webpack
import 'dotenv-defaults/config';

import mongoose from 'mongoose';

import { buildApp } from './app';
import { logger } from './utils/logger';

const main = function () {
  logger.info('🚀 Starting server...');

  const app = buildApp();

  const PORT = process.env.PORT ?? '3000';

  logger.info(`⚡ Starting mongoose`);
  mongoose.set('debug', true);
  mongoose
    .connect('mongodb://127.0.0.1:27017/simulazione-01')
    .then(() => {
      app.listen(PORT, () => {
        logger.info(`🚀 Server started on http://localhost:${PORT}`);
      });
    })
    .catch((error: unknown) => {
      logger.error('Error connecting to MongoDB', error);
    });
};

main();
