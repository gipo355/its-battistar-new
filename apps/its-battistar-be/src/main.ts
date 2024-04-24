/* eslint-disable no-magic-numbers */
import 'tslib'; // required for compilation since we are using typescript with webpack
import 'dotenv-defaults/config';

import type { Server } from 'node:http';

import mongoose from 'mongoose';

import { buildApp } from './app';
import { redisConnection } from './db/redis';
import { e } from './environments';
import { logger } from './utils/logger';

let server: Server | null = null;

export const main = async function () {
  logger.info('🚀 Starting server...');

  const app = await buildApp();

  app.on('close', () => {
    logger.info('🚀 Server closed');
  });

  server = app.listen(e.PORT, () => {
    logger.info(`🚀 Server started on http://localhost:${e.PORT}`);
  });
};

// FIXME: handle memory leaks, process hangs on dev restart
// possibly nx webpack issue
export function handleExit() {
  server?.close(() => {
    mongoose.connection.close().catch(logger.error);

    redisConnection.quit().catch(logger.error);
    logger.removeAllListeners();

    setTimeout(() => {
      logger.error('💥 Force close server');

      process.exit(1);
    }, 2000);
  });
}

if (e.NODE_ENV !== 'development') {
  process.on('unhandledRejection', (err) => {
    logger.error(err);
    logger.error('unhandler rejection, shutting down...');
    handleExit();
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down...');
    handleExit();
  });
}

main().catch((error: unknown) => {
  logger.error(`Unexpected error: ${JSON.stringify(error)}. Closing server...`);
  if (e.NODE_ENV === 'development') {
    process.exit(1);
  } else {
    logger.error('💥 Force close server');
    handleExit();
  }
});

const x = 3;

console.log(4);

console.log(4);
