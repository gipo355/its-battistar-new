import { Router } from 'express';
import helmet from 'helmet';
import pino from 'pino-http';

import { corsOptions, helmetOptions } from './config';
import bodyParser = require('body-parser');
import cors = require('cors');
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';

const router = Router();

router.use(cors(corsOptions));

router.use(helmet(helmetOptions));

router.use(pino());

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

router.use(rateLimiterMiddleware);

export { router as appMiddleware };
