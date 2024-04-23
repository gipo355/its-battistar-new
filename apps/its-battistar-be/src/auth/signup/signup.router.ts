import { Router } from 'express';

import { signupHandler } from './signup.handler';

const r = Router({
  mergeParams: true,
});

r.post('/', signupHandler);

export { r as signupRouter };
