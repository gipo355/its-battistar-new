/* eslint-disable n/no-process-exit */
/* eslint-disable no-magic-numbers */
import 'dotenv-defaults/config.js';

import mongoose from 'mongoose';

import { prepareMongo } from '../src/db/mongo';
import { setup } from './global-setup';
import { seedDB } from './seed-mongo';

async function setupEnvironment() {
  try {
    const started = await setup();
    if (!started) {
      console.warn('❌ Did not start the services, skipping seeding');
      return;
    }
    if (!started.commonStarted) {
      console.warn('❌ Did not start the common services, skipping seeding');
      return;
    }

    await prepareMongo();

    await seedDB();

    // await teardown();
    mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    mongoose.disconnect();
    process.exit(1);
  }
}

setupEnvironment().catch((e) => {
  console.error(e);
  process.exit(1);
});
