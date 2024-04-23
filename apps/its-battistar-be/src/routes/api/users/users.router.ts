import { Router } from 'express';

import {
  createUserHandler,
  deleteOneUserHandler,
  getAllUsersHandler,
  getMeHandler,
  getOneUserHandler,
  patchOneUserHandler,
} from './users.handler';

const r = Router({
  mergeParams: true,
});

r.get('/me', getMeHandler);

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
r.get('/', getAllUsersHandler);

/**
 * @openapi
 * /api/todos/{id}:
 *  get:
 *   tags:
 *    - todos
 *   description: get one todo
 *   responses:
 *    200:
 *     description: return a todo
 *    400:
 *     description: todo not found
 */
r.get('/:id', getOneUserHandler);

/**
 * @openapi
 * /api/todos/{id}:
 *  patch:
 *   tags:
 *    - todos
 *   description: get one todo
 *   responses:
 *    200:
 *     description: return a todo
 *    400:
 *     description: todo not found
 */
r.patch('/:id', patchOneUserHandler);

/**
 * @openapi
 * /api/todos/{id}:
 *  delete:
 *   tags:
 *    - todos
 *   description: delete one todo
 *   responses:
 *    204:
 *     description: return null
 *    400:
 *     description: todo not found
 */
r.delete('/:id', deleteOneUserHandler);

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
r.post('/', createUserHandler);

export { r as usersRouter };
