import { Router } from 'express';

import { logoutHandler } from './logout.handler';

const r = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /auth/logout:
 *  post:
 *   tags:
 *    - auth
 *   description: logout
 *   responses:
 *    200:
 *     description: logged out
 */
r.post('/', logoutHandler);

export { r as logoutRouter };
