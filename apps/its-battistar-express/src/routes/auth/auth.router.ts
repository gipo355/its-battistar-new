import { Router } from 'express';

import { googleCallbackHandler } from './google/google.handler';
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
 * /auth/google/callback:
 *  post:
 *   tags:
 *    - auth
 *   description: google callback
 *   responses:
 *    200:
 *     description: ok
 */
r.get('/google/callback', googleCallbackHandler);

export { r as authRouter };
