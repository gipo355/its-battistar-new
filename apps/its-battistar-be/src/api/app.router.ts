import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api:
 *  get:
 *   tags:
 *    - api
 *   description: create a checkout session
 *   responses:
 *    200:
 *     description: created review
 */
router.get('/', (_, response) => {
  response.send('Hello World!');
});

export { router as appRouter };
