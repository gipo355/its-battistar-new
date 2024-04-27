import { Router } from 'express';

import { signupHandler } from './signup.handler';

const r = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /auth/signup:
 *  post:
 *   tags:
 *    - auth
 *   description: signup
 *   responses:
 *    200:
 *     description: signed up
 */
r.post('/', signupHandler);

export { r as signupRouter };
