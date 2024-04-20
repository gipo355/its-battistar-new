import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../utils/app-error';

export const unsupportedMethodHandler: Handler = (request, _response, next) => {
  next(
    new AppError(
      `${request.method} is not a valid method on this endpoint`,
      StatusCodes.METHOD_NOT_ALLOWED
    )
  );
};
