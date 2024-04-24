/* eslint-disable n/no-unpublished-import */
/* eslint-disable no-magic-numbers */
/* eslint-disable @nx/enforce-module-boundaries */
// https://www.mongodb.com/developer/products/mongodb/seed-database-with-fake-data/
import 'dotenv-defaults/config.js';

import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

import {
  TTodoInput,
  TUserInput,
} from '../../../libs/shared-types/src/lib/index';
import { TodoModel } from '../src/routes/api/todos/todos.model';
import { UserModel } from '../src/routes/api/users/users.model';

// function randomIntFromInterval(min: number, max: number) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

const dataSet: {
  model: any;
  faker: any;
  batchSize: number;
  baseArray: any[];
}[] = [
  {
    model: UserModel,
    faker: {
      email: () => faker.internet.email(),
      name: () => faker.internet.userName(),
    },
    batchSize: 100,
    baseArray: [] as TUserInput[],
  },
  {
    model: TodoModel,
    faker: {
      title: () => faker.lorem.sentence(2),
      dueDate: () => faker.date.future().toString(),
    },
    batchSize: 100,
    baseArray: [] as TTodoInput[],
  },
];

const populateData = async (dataset: (typeof dataSet)[number]) => {
  for (let i = 0; i < dataset.batchSize; i++) {
    const newData = {
      ...Object.keys(dataset.faker).reduce((acc, key) => {
        acc[key] = dataset.faker[key]();
        return acc;
      }, {}),
    };
    dataset.baseArray.push(newData);
  }
  await dataset.model.insertMany(dataset.baseArray);
};

export async function seedDB() {
  try {
    console.log('Connected correctly to server');

    // Reset the database on every seed
    await UserModel.deleteMany({});
    await TodoModel.deleteMany({});

    // populate the database
    for (const dataset of dataSet) {
      await populateData(dataset);
    }

    console.log('Database seeded! :)');
  } catch (err) {
    mongoose.disconnect();
    // propagate the error up
    throw new Error(err);
  }
}
