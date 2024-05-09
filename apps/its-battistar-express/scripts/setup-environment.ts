/* eslint-disable n/no-process-exit */
/* eslint-disable no-magic-numbers */
import 'dotenv-defaults/config.js';

import mongoose from 'mongoose';

import { prepareMongo } from '../src/db/mongo';
import { setup } from './global-setup';
import { seedDB } from './seed-mongo';

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

    // sleep to allow the seeding to finish and dockers to spin up
    await sleep(1000);

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
