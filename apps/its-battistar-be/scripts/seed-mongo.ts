/* eslint-disable no-magic-numbers */
// require the necessary libraries
// const MongoClient = require('mongodb').MongoClient;

// https://www.mongodb.com/developer/products/mongodb/seed-database-with-fake-data/

const faker = require('faker');
import mongoose from 'mongoose';

import type {
  TTodoInput,
  TUserInput,
} from '../../../libs/shared-types/src/index';
import { prepareMongo } from '../src/db/mongo';
import { TodoModel } from '../src/routes/api/todos/todos.model';
import { UserModel } from '../src/routes/api/users/users.model';

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedDB() {
  // Connection URL
  // const uri = process.env.MONGO_STRING;

  try {
    await prepareMongo();
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
        name: faker.internet.name(),
      };
      for (let j = 0; j < 2; j++) {}
      userData.push(newUser);

      // todos
      const newTodo: TTodoInput = {
        title: faker.lorem.sentence(),
        dueDate: faker.date.future(),
      };

      todoData.push(newTodo);
    }

    UserModel.insertMany(userData);
    TodoModel.insertMany(todoData);

    console.log('Database seeded! :)');
    mongoose.connection.close();
  } catch (err) {
    console.log(err.stack);
  }
}

seedDB().catch(console.dir);
