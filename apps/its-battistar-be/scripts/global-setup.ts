/**
 * ## This will run globally once before all tests
 * has a separate scope, runs in its own process
 * must be activated in vitest.config.ts
 */

import 'dotenv-defaults/config.js';

import { execSync } from 'node:child_process';

import dockerCompose from 'docker-compose';

import { e } from '../src/environments/environment.dev';
import { isPortReachable } from './is-port-reachable.js';
import { seedDB } from './seed-mongo.js';

console.info('🌐 global-setup');

const buildTestEnvironment = async () => {
  if (!process.env.MONGO_PORT) {
    throw new Error('MONGO_PORT is not defined');
  }

  // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  const isDBReachable = await isPortReachable({
    // need environment variable for dev
    port: +process.env.MONGO_PORT,
  });

  if (!isDBReachable) {
    // TODO:  if e.ENABLE_LOKI is true, then start the full docker-compose with profile full

    // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
    await dockerCompose.upAll({
      cwd: new URL('../', import.meta.url).pathname,
      log: true,
    });

    if (e.ENABLE_LOKI === 'true') {
      await dockerCompose.upAll({
        cwd: new URL('../', import.meta.url).pathname,
        log: true,
        config: 'docker-compose.loki.yaml',
      });
    }

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
    // execSync('tsx ./scripts/seed-mongo.ts');

    await seedDB();

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
