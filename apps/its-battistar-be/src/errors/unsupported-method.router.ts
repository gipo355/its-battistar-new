import { Router } from 'express';

import { unsupportedMethodHandler } from './handlers/unsupported-method.handler';

const unsupportedMethodRouter = Router();
unsupportedMethodRouter.route('*').put(unsupportedMethodHandler);
export { unsupportedMethodRouter };
