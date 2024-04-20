import 'tslib'; // required for compilation since we are using typescript with webpack
import 'dotenv-defaults/config';

import type { Server } from 'node:http';

import mongoose from 'mongoose';

import { buildApp } from './app';
import { redisConnection } from './db/redis';
import { e } from './environment';
import { logger } from './utils/logger';

let server: Server | null = null;
// eslint-disable-next-line @typescript-eslint/require-await
const main = async function () {
  logger.info('🚀 Starting server...');

  const app = await buildApp();

  app.on('close', () => {
    logger.info('🚀 Server closed');
  });

  server = app.listen(e.PORT, () => {
    logger.info(`🚀 Server started on http://localhost:${e.PORT}`);
  });
};

function handleExit() {
  server?.close(() => {
    // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
    mongoose.connection.close().then().catch(logger.error);
    // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
    redisConnection.quit().then().catch(logger.error);
  });
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('unhandledRejection', (err) => {
  logger.error(err);
  logger.error('unhandler rejection, shutting down...');
  handleExit();
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...');
  handleExit();
});

main().catch((error: unknown) => {
  logger.error(`Unexpected error: ${JSON.stringify(error)}. Closing server...`);
  handleExit();
});
