import { Router } from 'express';
import helmet from 'helmet';
import pino from 'pino-http';

import { corsOptions, helmetOptions } from './config';
import bodyParser = require('body-parser');
import cors = require('cors');

const router = Router();

router.use(cors(corsOptions));

router.use(helmet(helmetOptions));

router.use(pino());

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

export { router as appMiddleware };
