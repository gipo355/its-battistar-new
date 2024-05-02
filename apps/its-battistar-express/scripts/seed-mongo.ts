/* eslint-disable no-await-in-loop */
/* eslint-disable n/no-unpublished-import */
/* eslint-disable no-magic-numbers */
/* eslint-disable @nx/enforce-module-boundaries */
// https://www.mongodb.com/developer/products/mongodb/seed-database-with-fake-data/
import 'dotenv-defaults/config.js';

import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

import {
  ERole,
  ETodoColorOptions,
} from '../../../libs/shared-types/src/lib/index';
import { TodoModel } from '../src/routes/api/todos/todos.model';
import { AccountModel } from '../src/routes/api/users/accounts.model';
import { UserModel } from '../src/routes/api/users/users.model';

// function randomIntFromInterval(min: number, max: number) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// must provide an enum to faker

// const todoDataset: {
//   model: any;
//   faker: any;
//   batchSize: number;
//   baseArray: any[];
// }[] = [
//   {
//     model: TodoModel,
//     faker: {
//       title: () => faker.lorem.sentence(2),
//       description: () => faker.lorem.sentence(10),
//       dueDate: () => faker.date.future().toString(),
//       completed: () => faker.datatype.boolean(),
//       color: () => faker.helpers.enumValue(ETodoColorOptions),
//     },
//     batchSize: 100,
//     baseArray: [] as TTodoInput[],
//   },
// ];

// const populateData = async (dataset: (typeof todoDataset)[number]) => {
//   for (let i = 0; i < dataset.batchSize; i++) {
//     const newData = {
//       ...Object.keys(dataset.faker).reduce((acc, key) => {
//         acc[key] = dataset.faker[key]();
//         return acc;
//       }, {}),
//     };
//     dataset.baseArray.push(newData);
//   }
//   await dataset.model.insertMany(dataset.baseArray);
// };

export async function seedDB(): Promise<void> {
  try {
    console.log('Connected correctly to server');

    // Reset the database on every seed
    await UserModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TodoModel.deleteMany({});

    // populate the database
    // for (const dataset of todoDataset) {
    //   await populateData(dataset);
    // }

    const userIds: string[] = [];
    for (let i = 0; i < 20; i++) {
      const user = await UserModel.create({
        username: faker.internet.userName(),
        role: faker.helpers.enumValue(ERole),
      });
      await AccountModel.create({
        user: user._id,
        email: faker.internet.email(),
        avatar: 'https://avatar.iran.liara.run/public/3',
        verified: faker.datatype.boolean(),
        strategy: 'LOCAL',
        primary: true,
        password: faker.internet.password(),
      });
      await AccountModel.create({
        user: user._id,
        email: faker.internet.email(),
        verified: faker.datatype.boolean(),
        strategy: 'GITHUB',
        primary: false,
        providerId: faker.string.uuid(),
        providerAccessToken: faker.string.uuid(),
      });
      userIds.push(user._id as string);
    }

    for (let i = 0; i < 100; i++) {
      // seed todos
      await TodoModel.create({
        user: faker.helpers.arrayElement(userIds),
        title: faker.lorem.sentence(3),
        description: faker.lorem.sentence(10),
        dueDate: faker.helpers.arrayElement([
          faker.date.future().toString(),
          faker.date.recent().toString(),
          new Date().toISOString(),
          faker.date.past().toString(),
        ]),
        completed: faker.datatype.boolean(),
        color: faker.helpers.enumValue(ETodoColorOptions),
      });
    }

    console.log('Database seeded! :)');
  } catch (err) {
    await mongoose.disconnect();
    // propagate the error up
    throw new Error(err);
  }
}
