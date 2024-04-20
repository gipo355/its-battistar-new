import * as Sentry from '@sentry/node';
// import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { e } from '../environment';
import { logger } from '../utils/logger';
import { errorsHandler } from './errors.handler';
import { pageNotFoundHandler } from './page-not-found/page-not-found.handler';
import { unsupportedMethodHandler } from './unsupported-method/unsupported-method.handler';
// import { AppError } from '../helpers';

const router = Router();

/**
 * ## catch unsupported methods
 */
router.route('*').put(unsupportedMethodHandler);

/**
 * ## catch page not found 404
 */
router.use('*', pageNotFoundHandler);

/**
 * ## sentry
 */
// The error handler must be before any other error middleware and after all controllers
if (e.SENTRY_DSN) {
  router.use(Sentry.Handlers.errorHandler());
  logger.info('Sentry enabled');
}

/**
 * ## IMP: Error handling
 * Global error handler, gets passed the error object from all previous middlewares after every route is checked
 * Lifecycle ends here
 */
router.use(errorsHandler);

export { router as errorsRouter };
