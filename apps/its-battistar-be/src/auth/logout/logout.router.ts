import { Router } from 'express';

import { logoutHandler } from './logout.handler';

const r = Router({
  mergeParams: true,
});

r.get('/', logoutHandler);

export { r as loginRouter };
