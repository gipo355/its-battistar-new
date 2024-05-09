import { Router } from 'express';

import { verifyHandler } from './verify.handler';

const r = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /auth/verify:
 *  get:
 *   tags:
 *    - auth
 *   description: this function checks if there are query params to verify email or password reset.
 *   if not, it will verify the access token and return 200 with the user object.
 *   responses:
 *    200:
 *     description: logged in
 */
r.get('/', verifyHandler);

export { r as verifyRouter };
