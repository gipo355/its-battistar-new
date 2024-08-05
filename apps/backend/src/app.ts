import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import apiRouter from './api/routes';
import { errorHandlers } from './errors';
import { globalMiddleware } from './middleware/global-middleware';
import type { IUser } from './schemas/user.schema';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(globalMiddleware);

app.use('/api', apiRouter);

app.use(errorHandlers);

export default app;

declare module 'express' {
    interface Request {
        user?: IUser | null;
    }
}
