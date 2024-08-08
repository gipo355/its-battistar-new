import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';

import apiRouter from './api/routes';
import type { IUser } from './api/users/user.entity';
import { errorHandlers } from './errors';
import { AppError } from './utils/app-error';
import { globalMiddleware } from './utils/global-middleware';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(globalMiddleware);

app.use('/api', apiRouter);

// catch all and return 404
app.use('*', () => {
    throw new AppError({
        message: 'Where are you going?',
        code: StatusCodes.NOT_FOUND,
    });
});

app.use(errorHandlers);

export default app;

declare module 'express' {
    interface Request {
        user?: IUser | null;
    }
}
