import { Router } from 'express';

import { githubCallbackHandler, githubHandler } from './github/github.handler';
import { loginRouter } from './login/login.router';
import { logoutRouter } from './logout/logout.router';
import { refreshRouter } from './refresh/refresh.router';
import { signupRouter } from './signup/signup.router';

const r = Router();

r.use('/login', loginRouter);

r.use('/signup', signupRouter);

r.use('/refresh', refreshRouter);

r.use('/logout', logoutRouter);

/**
 * @openapi
 * /auth/github:
 *  post:
 *   tags:
 *    - auth
 *   description: github initial
 *   responses:
 *    200:
 *     description: ok
 */
r.get('/github', githubHandler);
/**
 * @openapi
 * /auth/google/callback:
 *  post:
 *   tags:
 *    - auth
 *   description: github callback
 *   responses:
 *    200:
 *     description: ok
 */
r.get('/github/callback', githubCallbackHandler);

export { r as authRouter };
