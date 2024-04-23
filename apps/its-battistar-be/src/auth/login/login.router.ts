import { Router } from 'express';

import { loginHandler } from './login.handler';

const r = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /auth/login:
 *  post:
 *   tags:
 *    - auth
 *   description: login
 *   responses:
 *    200:
 *     description: logged in
 */
r.post('/', loginHandler);

export { r as loginRouter };
