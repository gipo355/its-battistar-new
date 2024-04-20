import mongoose from 'mongoose';

import { logger } from '../utils/logger';

export const prepareMongo = async () => {
  const MONGO_STRING = process.env.MONGO_STRING;
  if (!MONGO_STRING) {
    logger.error('MONGO_STRING is not defined, database connection will fail.');
    throw new Error(
      'MONGO_STRING is not defined, database connection will fail.'
    );
  }

  logger.info(`⚡ Starting mongoose`);
  mongoose.set('debug', true);
  await mongoose.connect(MONGO_STRING, {}).catch((error: unknown) => {
    logger.error(`Error connecting to MongoDB ${JSON.stringify(error)}`);
  });
};
