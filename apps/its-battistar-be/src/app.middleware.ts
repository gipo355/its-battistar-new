import { json, Router, urlencoded } from 'express';
import ExpressMongoSanitize = require('express-mongo-sanitize');
import helmet from 'helmet';
import hpp = require('hpp');
import pino from 'pino-http';

import { corsOptions, helmetOptions } from './config';
import cors = require('cors');
import cookieParser = require('cookie-parser');

// eslint-disable-next-line unicorn/prevent-abbreviations
import { environment as e } from './environment';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { logger } from './utils/logger';

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

router.use(pino());

e.NODE_ENV !== 'development' && router.use(rateLimiterMiddleware);

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
router.use((request, _, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

export { router as appMiddleware };
