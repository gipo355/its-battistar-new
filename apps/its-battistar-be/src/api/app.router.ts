import { Router } from 'express';

import { todosRouter } from './todos/todos.router';

const appRouter = Router();

appRouter.use('/todos', todosRouter);

export { appRouter };
