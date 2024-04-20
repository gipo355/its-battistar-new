import { Router } from 'express';

import { checkRouter } from './check/check.router';
import { createTodo, getAllTodos } from './todos.handler';

const todosRouter = Router({
  mergeParams: true,
});

todosRouter.use('/:id', checkRouter);

/**
 * @openapi
 * /api/todos:
 *  get:
 *   tags:
 *    - todos
 *   description: get all todos
 *   responses:
 *    200:
 *     description: return all todos
 */
todosRouter.get('/', getAllTodos);
/**
 * @openapi
 * /api/todos:
 *  post:
 *   tags:
 *    - todos
 *   description: create a new todo
 *
 *   responses:
 *    200:
 *     description: created todo
 *    400:
 *     description: invalid data
 *
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *         description: title of the todo
 *        dueDate:
 *         type: string
 *         description: due date of the todo
 */
todosRouter.post('/', createTodo);

export { todosRouter };
