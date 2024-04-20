import * as Sentry from '@sentry/node';
// import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { ENABLE_SENTRY } from '../config';
import { logger } from '../utils/logger';
import { pageNotFoundController } from './handlers/page-not-found.handler';
import { unsupportedMethodHandler } from './handlers/unsupported-method.handler';
// import { AppError } from '../helpers';

const router = Router();

/**
 * ## catch unsupported methods
 */
router.route('*').put(unsupportedMethodHandler);

/**
 * ## catch page not found 404
 */
// router.use('*', (req: Request, _res: Response, next: NextFunction) => {
//   next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
// });
router.use('*', pageNotFoundController);

/**
 * ## sentry
 */
// The error handler must be before any other error middleware and after all controllers
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (ENABLE_SENTRY) {
  router.use(Sentry.Handlers.errorHandler());
  logger.info('Sentry enabled');
}

/**
 * ## Error handling
 * Global error handler, gets passed the error object from all previous middlewares after every route is checked
 */
// router.use(globalErrorController);
// router.use('*', globalErrorController);
export { router as errorsRouter };
