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

/**
 * @openapi
 * /api/users/me:
 *  get:
 *   tags:
 *    - users
 *   description: get all users
 *   responses:
 *    200:
 *     description: return all users
 */
r.get('/me', getMeHandler);

/**
 * @openapi
 * /api/users:
 *  get:
 *   tags:
 *    - users
 *   description: get all users
 *   responses:
 *    200:
 *     description: return all users
 */
r.get('/', getAllUsersHandler);

/**
 * @openapi
 * /api/users/{id}:
 *  get:
 *   tags:
 *    - users
 *   description: get one user
 *   responses:
 *    200:
 *     description: return a user
 *    400:
 *     description: user not found
 */
r.get('/:id', getOneUserHandler);

/**
 * @openapi
 * /api/users/{id}:
 *  patch:
 *   tags:
 *    - users
 *   description: update one user
 *   responses:
 *    200:
 *     description: return a user
 *    400:
 *     description: user not found
 */
r.patch('/:id', patchOneUserHandler);

/**
 * @openapi
 * /api/users/{id}:
 *  delete:
 *   tags:
 *    - users
 *   description: delete one user
 *   responses:
 *    204:
 *     description: return null
 *    400:
 *     description: user not found
 */
r.delete('/:id', deleteOneUserHandler);

/**
 * @openapi
 * /api/users:
 *  post:
 *   tags:
 *    - users
 *   description: create a new user
 *
 *   responses:
 *    200:
 *     description: created user
 *    400:
 *     description: invalid data
 *
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: created user
 */
r.post('/', createUserHandler);

export { r as usersRouter };
