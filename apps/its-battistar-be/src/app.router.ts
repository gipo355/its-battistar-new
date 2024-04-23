import { Router } from 'express';

import { apiRouter } from './api/api.router';

const appRouter = Router();

appRouter.use('/api', apiRouter);

export { appRouter };
