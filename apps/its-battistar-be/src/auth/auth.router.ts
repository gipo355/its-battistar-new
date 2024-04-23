import { Router } from 'express';

import { loginRouter } from './login/login.router';
import { logoutHandler } from './logout/logout.handler';
import { refreshHandler } from './refresh/refresh.handler';
import { signupRouter } from './signup/signup.router';

const r = Router();

r.use('/login', loginRouter);

r.use('/signup', signupRouter);

r.use('/refresh', refreshHandler);

r.use('/logout', logoutHandler);

export { r as authRouter };
