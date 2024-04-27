import { Router } from 'express';

import { apiRouter } from './routes/api/api.router';
import { authRouter } from './routes/auth/auth.router';

const appRouter = Router();

appRouter.use('/api', apiRouter);
appRouter.use('/auth', authRouter);

export { appRouter };
