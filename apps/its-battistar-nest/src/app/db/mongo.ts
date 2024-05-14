import mongoose from 'mongoose';

const MONGO_USERNAME = process.env.MONGO_USERNAME;

const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const MONGO_PORT = process.env.MONGO_PORT;

if (!MONGO_USERNAME || !MONGO_PASSWORD || !MONGO_PORT) {
  throw new Error(
    'Please define MONGO_USERNAME, MONGO_PASSWORD, and MONGO_PORT'
  );
}

const connection = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}`;

export const connectMongoloid = async (): Promise<typeof mongoose> => {
  mongoose.set('debug', false);

  mongoose.set('strictQuery', false);

  return mongoose.connect(connection, {
    authSource: 'admin',
  });
};
