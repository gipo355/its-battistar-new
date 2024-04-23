import { Router } from 'express';

import { todosRouter } from './todos/todos.router';
import { usersRouter } from './users/users.router';

const apiRouter = Router();

apiRouter.use('/todos', todosRouter);

apiRouter.use('/users', usersRouter);

export { apiRouter };
