import mongoose from 'mongoose';

import { e } from '../../environments';
import { logger } from '../../utils/logger';

export const prepareMongo = async (): Promise<void> => {
  try {
    if (!e.MONGO_STRING) {
      throw new Error(
        'MONGO_STRING is not defined, database connection will fail.'
      );
    }

    logger.info(`⚡ Starting mongoose`);

    // show mongoose debug logs
    mongoose.set('debug', false);
    // handle deprecation warning
    mongoose.set('strictQuery', false);

    await mongoose.connect(e.MONGO_STRING, {
      authSource: 'admin',
    });
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${JSON.stringify(error)}`);
  }
};
