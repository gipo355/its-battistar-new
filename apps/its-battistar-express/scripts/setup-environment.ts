/* eslint-disable n/no-process-exit */
/* eslint-disable no-magic-numbers */
import 'dotenv-defaults/config.js';

import mongoose from 'mongoose';

import { prepareMongo } from '../src/db/mongo';
import { setup } from './global-setup';
import { seedDB } from './seed-mongo';

async function setupEnvironment() {
  try {
    // const started = await setup();
    await setup();
    // if (!started.commonStarted) {
    //   console.warn('❌ Did not start the common services, skipping seeding');
    //   return;
    // }

    await prepareMongo();

    await seedDB();

    // await teardown();
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  }
}

setupEnvironment().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
