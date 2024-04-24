/**
 * ## This will run globally once before all tests
 * has a separate scope, runs in its own process
 * must be activated in vitest.config.ts
 */

// import { execSync } from 'node:child_process';

import dockerCompose from 'docker-compose';

import { e } from '../src/environments/environment.dev';
import { isPortReachable } from './is-port-reachable.js';

console.info('🌐 global-setup');

let lokiStarted = false;
let commonStarted = false;

const dockerComposeItems = {
  loki: {
    cwd: new URL('../', import.meta.url).pathname,
    log: true,
    config: 'docker-compose.loki.yaml',
  },
  common: {
    cwd: new URL('../', import.meta.url).pathname,
    log: true,
    config: 'docker-compose.yaml',
  },
};

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
    console.warn(
      '🚨 Database is not reachable, starting the infrastructure...'
    );

    // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
    await dockerCompose.upAll(dockerComposeItems.common);
    commonStarted = true;

    if (e.ENABLE_LOKI === 'true') {
      await dockerCompose.upAll(dockerComposeItems.loki);
      lokiStarted = true;
    }

    // await dockerCompose.exec(
    //     'database',
    //     ['sh', '-c', 'until pg_isready ; do sleep 1; done'],
    //     {
    //         cwd: path.join(__dirname),
    //     }
    // );

    //example, seeding the database
    // we could write it here or create a separate script
    //✅ Best Practice: Use npm script for data seeding and migrations
    // execSync('npx prisma migrate dev');
    // execSync('tsx ./scripts/seed-mongo.ts');

    // const { seedDB } = await import('./seed-mongo.js');
    // await seedDB();

    commonStarted = true;

    // ✅ Best Practice: Seed only metadata and not test record, read "Dealing with data" section for further information
    // execSync('npx prisma run db:seed');
  } else {
    console.warn(
      '🚀 Database is already reachable, skipping the infrastructure...'
    );
  }

  // 👍🏼 We're ready
  console.info('🌐 global-setup: done');

  return {
    commonStarted,
    lokiStarted,
  };
};

const teardown = async () => {
  // if (lokiStarted) {
  await dockerCompose.down(dockerComposeItems.loki);
  // }

  // if (commonStarted) {
  await dockerCompose.down(dockerComposeItems.common);
  // }
};

/**
 * ## This is a shared setup hook from globalSetup
 */
const setup = async () => {
  try {
    const { commonStarted, lokiStarted } = await buildTestEnvironment();
    return {
      commonStarted,
      lokiStarted,
    };
  } catch (e) {
    await teardown();
  }
};

export { setup, teardown };
