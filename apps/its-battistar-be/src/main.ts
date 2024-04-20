import 'tslib'; // required for compilation since we are using typescript with webpack
import 'dotenv-defaults/config';

import type { Server } from 'node:http';

import mongoose from 'mongoose';

import { buildApp } from './app';
import { redisConnection } from './db/redis';
import { environment } from './environment';
import { logger } from './utils/logger';
import { exitTimer } from './utils/timer';

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

async function handleExit() {
  await Promise.race([
    exitTimer(5000),
    new Promise<void>((resolve) =>
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      server?.close(async () => {
        await mongoose.connection.close();
        await redisConnection.quit();
        resolve();
      })
    ),
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('unhandledRejection', async (err) => {
  logger.error(err);
  logger.error('unhandler rejection, shutting down...');
  await handleExit();
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await handleExit();
});

main().catch(async (error: unknown) => {
  logger.error(`Unexpected error: ${JSON.stringify(error)}. Closing server...`);
  await handleExit();
});
