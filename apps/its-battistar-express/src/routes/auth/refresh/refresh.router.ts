import { Router } from 'express';

import { refreshHandler } from './refresh.handler';

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
r.post('/', refreshHandler);

export { r as refreshRouter };
