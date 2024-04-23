import * as Sentry from '@sentry/node';
// import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { e } from '../environments';
import { logger } from '../utils/logger';
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

export { router as preErrorsRouter };
