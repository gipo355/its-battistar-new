import { Router } from 'express';
import pino from 'pino-http';

import { corsOptions } from './config';
import bodyParser = require('body-parser');
import cors = require('cors');

const router = Router();

router.use(cors(corsOptions));
router.use(pino());
router.use(bodyParser.json());

export { router as appMiddleware };
