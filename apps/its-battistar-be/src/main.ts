import 'tslib'; // required for compilation since we are using typescript with webpack
import 'dotenv-defaults/config';

import type { Server } from 'node:http';

import mongoose from 'mongoose';

import { buildApp } from './app';
import { environment } from './environment';
import { logger } from './utils/logger';

let server: Server | null = null;
// eslint-disable-next-line @typescript-eslint/require-await
const main = async function () {
  logger.info('🚀 Starting server...');

  const app = await buildApp();

  app.on('close', () => {
    logger.info('🚀 Server closed');
  });

  server = app.listen(environment.PORT, () => {
    logger.info(`🚀 Server started on http://localhost:${environment.PORT}`);
  });
};

main().catch((error: unknown) => {
  logger.error(`Unexpected error: ${JSON.stringify(error)}. Closing server...`);

  server?.close(() => {
    mongoose.connection.close().catch(() => {
      logger.error('Error closing mongoose connection');
    });

    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
    process.exit(1);
  });
});
