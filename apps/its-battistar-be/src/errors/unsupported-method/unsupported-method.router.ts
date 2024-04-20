import { Router } from 'express';

import { unsupportedMethodHandler } from './unsupported-method.handler';

const unsupportedMethodRouter = Router();
unsupportedMethodRouter.route('*').put(unsupportedMethodHandler);
export { unsupportedMethodRouter };
