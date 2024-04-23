import 'dotenv-defaults/config.js';

// https://www.mongodb.com/developer/products/mongodb/seed-database-with-fake-data/
/* eslint-disable no-magic-numbers */
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  TTodoInput,
  TUserInput,
  // eslint-disable-next-line n/no-unpublished-import
} from '../../../libs/shared-types/src/lib/index';
import { TodoModel } from '../src/routes/api/todos/todos.model';
import { UserModel } from '../src/routes/api/users/users.model';

// function randomIntFromInterval(min: number, max: number) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

export async function seedDB() {
  // Connection URL
  try {
    console.log('Connected correctly to server');

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    UserModel.deleteMany({});
    TodoModel.deleteMany({});

    // make a bunch of time series data
    const userData: TUserInput[] = [];
    const todoData: TTodoInput[] = [];

    for (let i = 0; i < 100; i++) {
      // users
      const newUser = {
        email: faker.internet.email(),
        name: faker.internet.userName(),
      };
      for (let j = 0; j < 2; j++) {}
      userData.push(newUser);

      // todos
      const newTodo: TTodoInput = {
        // title: faker.lorem.sentence(),
        title: 'alkdfldkfafl askdfalskf asdfk',
        dueDate: faker.date.future().toString(),
      };
      todoData.push(newTodo);
    }

    UserModel.insertMany(userData);
    TodoModel.insertMany(todoData);

    console.log('Database seeded! :)');
    mongoose.connection.close();
  } catch (err) {
    console.error(err.stack);
    mongoose.connection.close();
    throw new Error(err);
  }
}

// seedDB().catch(console.dir);
