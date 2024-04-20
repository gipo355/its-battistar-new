import { Router } from 'express';
import helmet from 'helmet';
import pino from 'pino-http';

import { corsOptions, helmetOptions } from './config';
import bodyParser = require('body-parser');
import cors = require('cors');
import cookieParser = require('cookie-parser');

import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';

const router = Router();

router.use(cors(corsOptions));
router.options('*', cors(corsOptions));

router.use(helmet(helmetOptions));

router.use(pino());

router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

router.use(rateLimiterMiddleware);

export { router as appMiddleware };
