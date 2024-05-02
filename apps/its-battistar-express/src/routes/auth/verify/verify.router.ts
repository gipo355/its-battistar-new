import { Router } from 'express';

import { verifyHandler } from './verify.handler';

const r = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /auth/refresh:
 *  get:
 *   tags:
 *    - auth
 *   description: get refresh token
 *   responses:
 *    200:
 *     description: logged in
 */
r.get('/', verifyHandler);

export { r as verifyRouter };
