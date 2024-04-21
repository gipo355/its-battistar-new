import mongoose from 'mongoose';

import { e } from '../../environment';
import { logger } from '../../utils/logger';

export const prepareMongo = async () => {
  try {
    if (!e.MONGO_STRING) {
      throw new Error(
        'MONGO_STRING is not defined, database connection will fail.'
      );
    }

    logger.info(`⚡ Starting mongoose`);

    mongoose.set('debug', true);
    // handle deprecation warning
    mongoose.set('strictQuery', false);

    await mongoose.connect(e.MONGO_STRING, {});
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${JSON.stringify(error)}`);
  }
};
