/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express = require('express');
import path = require('path');

import { sharedTypes } from '@its-battistar/shared-types';

console.log(sharedTypes());

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (_, response) => {
  response.send({ message: 'Welcome to its-battistar-be!' });
});

const port = process.env.PORT ?? '3333';

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
