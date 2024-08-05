import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import apiRouter from './api/routes';
import { errorHandlers } from './errors';
import type { User } from './types/user.schema';

declare module 'express' {
    export interface Request {
        user?: User;
    }
}

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(errorHandlers);

export default app;
