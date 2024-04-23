import { Router } from 'express';

import { refreshHandler } from './refresh.handler';

const r = Router({
  mergeParams: true,
});

r.get('/', refreshHandler);

export { r as loginRouter };
