import 'tslib'; // required for compilation since we are using typescript with webpack
import 'dotenv-defaults/config';

import mongoose from 'mongoose';

import { buildApp } from './app';
import { logger } from './utils/logger';

// eslint-disable-next-line @typescript-eslint/require-await
const main = async function () {
  logger.info('🚀 Starting server...');

  const PORT = process.env.PORT ?? '3000';

  const app = await buildApp();

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
