import mongoose from 'mongoose';

import { logger } from '../utils/logger';

export const prepareMongo = async () => {
  try {
    const MONGO_STRING = process.env.MONGO_STRING;

    if (!MONGO_STRING) {
      throw new Error(
        'MONGO_STRING is not defined, database connection will fail.'
      );
    }

    logger.info(`⚡ Starting mongoose`);

    mongoose.set('debug', true);
    // handle deprecation warning
    mongoose.set('strictQuery', false);

    await mongoose.connect(MONGO_STRING, {});
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${JSON.stringify(error)}`);
  }
};
