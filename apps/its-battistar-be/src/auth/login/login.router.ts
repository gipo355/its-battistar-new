import { Router } from 'express';

import { loginHandler } from './login.handler';

const r = Router({
  mergeParams: true,
});

r.post('/', loginHandler);

export { r as loginRouter };
