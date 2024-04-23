/**
 * ## This will run globally once before all tests
 * has a separate scope, runs in its own process
 * must be activated in vitest.config.ts
 */

import 'dotenv-defaults/config.js';

import { execSync } from 'node:child_process';

import dockerCompose from 'docker-compose';

import { isPortReachable } from './is-port-reachable';

console.info('🌐 global-setup');

const buildTestEnvironment = async () => {
  if (!process.env.MONGO_PORT) {
    throw new Error('MONGO_PORT is not defined');
  }
  const fullDocker = process.env.ENABLE_LOKI === 'true';

  // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  const isDBReachable = await isPortReachable({
    port: +process.env.MONGO_PORT,
  });

  if (!isDBReachable) {
    // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
    await dockerCompose.upAll({
      cwd: new URL('../', import.meta.url).pathname,
      log: true,
    });

    // await dockerCompose.exec(
    //     'database',
    //     ['sh', '-c', 'until pg_isready ; do sleep 1; done'],
    //     {
    //         cwd: path.join(__dirname),
    //     }
    // );

    // ️️️✅ Best Practice: Use npm script for data seeding and migrations
    // execSync('npx pri/* sm */a migrate dev');
    execSync('echo "🌱 Seeding database"');
    execSync('tsx ./seed-mongo.ts');
    // ✅ Best Practice: Seed only metadata and not test record, read "Dealing with data" section for further information
    // execSync('npx prisma run db:seed');
  }

  // 👍🏼 We're ready
  console.info('🌐 global-setup: done');
};

/**
 * ## This is a shared setup hook from globalSetup
 */
const setup = async () => {
  await buildTestEnvironment();
};

const teardown = async () => {};

export { setup, teardown };
