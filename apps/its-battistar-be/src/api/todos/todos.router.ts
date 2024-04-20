import { Router } from 'express';

import { getAllTodos } from './todos.handler';

const todosRouter = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /api/todos:
 *  get:
 *   tags:
 *    - api
 *   description: get all todos
 *   responses:
 *    200:
 *     description: created review
 */
todosRouter.get('/', getAllTodos);

export { todosRouter };
