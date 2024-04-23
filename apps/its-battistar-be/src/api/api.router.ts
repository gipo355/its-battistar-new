import { Router } from 'express';

import { todosRouter } from './todos/todos.router';

const apiRouter = Router();

apiRouter.use('/todos', todosRouter);

export { apiRouter };
