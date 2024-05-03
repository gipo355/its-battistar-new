import * as Sentry from '@sentry/node';
import { json, Router, urlencoded } from 'express';

import { APP_CONFIG as c } from './app.config';
import ExpressMongoSanitize = require('express-mongo-sanitize');
import helmet from 'helmet';
import hpp = require('hpp');
import pino from 'pino-http';

import cors = require('cors');
import cookieParser = require('cookie-parser');

import { environment as e } from './environments';
import { rateLimiterMiddleware } from './shared/rate-limiter.service';
import { logger } from './utils/logger';

const router = Router();

/**
 * ## Security
 */
router.use(cors(c.corsOptions));
router.options('*', cors(c.corsOptions));

router.use(helmet(c.helmetOptions));

router.use(
  // prevent parameter pollution
  hpp({
    // whitelist parameters accepted
    whitelist: ['showCompleted', 'limit', 'sort', 'page', 'fields'],
  })
);

/**
 * ## Logging
 */
router.use(
  pino(
    e.NODE_ENV === 'development'
      ? {
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: {
              ignore: 'pid,hostname',
              colorize: true,
            },
          },
        }
      : {}
  )
);

if (e.SENTRY_DSN) {
  Sentry.init({
    dsn: e.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app: router }),
      // Automatically instrument Node.js libraries and frameworks
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1,
  });
  // RequestHandler creates a separate execution context, so that all
  // transactions/spans/breadcrumbs are isolated across requests
  router.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  router.use(Sentry.Handlers.tracingHandler());
}

/**
 * ## Rate limiter
 */
if (e.ENABLE_RATE_LIMITER !== 'false' && e.NODE_ENV !== 'development') {
  router.use(rateLimiterMiddleware);
  logger.info(
    `Rate limiter set to ${e.RATE_LIMITER_POINTS.toString()} requests per ${e.RATE_LIMITER_DURATION.toString()} seconds`
  );
}

/**
 * ## Parsers
 */
router.use(cookieParser(e.COOKIE_SECRET));

router.use(urlencoded({ extended: true, limit: '10kb' }));

router.use(
  json({
    limit: '10kb',
    type: 'application/json',
  })
);

/**
 * ## Sanitize
 * after parsers
 */
router.use(
  ExpressMongoSanitize({
    onSanitize: (object) => {
      const logObject = {
        message: `Sanitized a ${object.key} with express-mongo-sanitize`,
        originalUrl: object.req.originalUrl,
        query: object.req.query,
        data: object,
      };
      logger.warn(logObject);
    },
  })
);

router.use((request, _, next) => {
  request.requestTime = new Date().toISOString();
  // initialize user for performance and security on every request
  request.user = null;
  request.tokenPayload = null;
  next();
});

export { router as appMiddleware };
