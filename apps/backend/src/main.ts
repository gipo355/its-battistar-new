import 'reflect-metadata';

import mongoose from 'mongoose';

import app from './app';

// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT ?? 3000;

mongoose.set('debug', true);
mongoose
    .connect('mongodb://127.0.0.1:27017/simulazione-01')
    .then(() => {
        console.log('Connected to db');
        app.listen(PORT, () => {
            console.log('Server listening on port 3000');
        });
    })
    .catch((err: unknown) => {
        console.error(err);
    });
