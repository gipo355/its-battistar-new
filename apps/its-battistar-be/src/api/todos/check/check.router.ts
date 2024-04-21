import { Router } from 'express';

import { markForCheck, markForUncheck } from './check.handler';

const checkRouter = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /api/todos/:id/check:
 *  patch:
 *   tags:
 *    - todos
 *   description: check a todo
 *   responses:
 *    200:
 *     description: checked
 */
checkRouter.patch('/', markForCheck);
/**
 * @openapi
 * /api/todos/:id/check:
 *  delete:
 *   tags:
 *    - todos
 *   description: uncheck a todo
 *
 *   responses:
 *    200:
 *     description: checked
 *    400:
 *     description: invalid todo
 *
 */
checkRouter.delete('/', markForUncheck);

export { checkRouter };
