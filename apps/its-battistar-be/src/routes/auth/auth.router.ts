import { Router } from 'express';

import { loginRouter } from './login/login.router';
import { logoutRouter } from './logout/logout.router';
import { refreshRouter } from './refresh/refresh.router';
import { signupRouter } from './signup/signup.router';

const r = Router();

r.use('/login', loginRouter);

r.use('/signup', signupRouter);

r.use('/refresh', refreshRouter);

r.use('/logout', logoutRouter);

export { r as authRouter };
