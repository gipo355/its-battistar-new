import 'dotenv-defaults/config.js';

import { prepareMongo } from '../src/db/mongo';
import { setup } from './global-setup';
import { seedDB } from './seed-mongo';

async function setupEnvironment() {
  try {
    await setup();

    await prepareMongo();

    await seedDB();

    // await teardown();
  } catch (e) {
    console.error(e);
  }
}

setupEnvironment();
