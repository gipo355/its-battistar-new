import 'tslib'; // required for compilation since we are using typescript with webpack
import 'dotenv-defaults/config';

import mongoose from 'mongoose';

import { buildApp } from './app';
import { logger } from './utils/logger';

const main = async function () {
  logger.info('🚀 Starting server...');

  const app = buildApp();

  const PORT = process.env.PORT ?? '3000';
  const MONGO_STRING = process.env.MONGO_STRING;
  if (!MONGO_STRING) {
    logger.error('MONGO_STRING is not defined, database connection will fail.');
    throw new Error(
      'MONGO_STRING is not defined, database connection will fail.'
    );
  }

  logger.info(`⚡ Starting mongoose`);
  mongoose.set('debug', true);
  await mongoose.connect(MONGO_STRING).catch((error: unknown) => {
    logger.error('Error connecting to MongoDB', error);
  });

  app.on('close', () => {
    logger.info('🚀 Server closed');
  });
  app.listen(PORT, () => {
    logger.info(`🚀 Server started on http://localhost:${PORT}`);
  });
};

main().catch(async (error: unknown) => {
  logger.error(`Unexpected error: ${JSON.stringify(error)} `);
  await mongoose.connection.close();
});
