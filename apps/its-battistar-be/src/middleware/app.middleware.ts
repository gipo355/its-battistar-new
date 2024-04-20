import * as Sentry from '@sentry/node';
import { json, Router, urlencoded } from 'express';

import {
  corsOptions,
  ENABLE_SENTRY,
  helmetOptions,
  RATE_LIMITER_DURATION,
  RATE_LIMITER_POINTS,
} from '../config';
import ExpressMongoSanitize = require('express-mongo-sanitize');
import helmet from 'helmet';
import hpp = require('hpp');
import pino from 'pino-http';

import cors = require('cors');
import cookieParser = require('cookie-parser');

// eslint-disable-next-line unicorn/prevent-abbreviations
import { environment as e } from '../environment';
import { rateLimiterMiddleware } from './rate-limiter.middleware';
import { logger } from '../utils/logger';

const router = Router();

router.use(cors(corsOptions));
router.options('*', cors(corsOptions));

router.use(helmet(helmetOptions));

router.use(
  // prevent parameter pollution
  hpp({
    // whitelist parameters
    whitelist: ['name'],
  })
);

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

if (e.NODE_ENV !== 'development') {
  router.use(rateLimiterMiddleware);
  logger.info(
    `Rate limiter set to ${RATE_LIMITER_POINTS.toString()} requests per ${RATE_LIMITER_DURATION.toString()} seconds`
  );
}

// Parsers
router.use(cookieParser(e.COOKIE_SECRET));

router.use(urlencoded({ extended: true, limit: '10kb' }));

router.use(
  json({
    limit: '10kb',
    type: 'application/json',
  })
);

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

/**
 * ## SENTRY
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (ENABLE_SENTRY) {
  Sentry.init({
    dsn: process.env.NATOUR_SENTRY_DSN,
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

router.use((request, _, next) => {
  request.requestTime = new Date().toISOString();
  // initialize user for performance and security on every request
  request.user = null;
  next();
});

export { router as appMiddleware };
