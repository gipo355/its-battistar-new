import { ErrorRequestHandler } from 'express';

import { logger } from '../utils/logger';

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  logger.error(error);

  next(error);
};

export const errorHandlers = [errorHandler];
