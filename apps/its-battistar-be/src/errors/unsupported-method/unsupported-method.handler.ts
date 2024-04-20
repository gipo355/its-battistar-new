import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../utils/app-error';

// ! router for handling unsupported methods
export const unsupportedMethodHandler = (
  _request: Request,
  _response: Response,
  next: NextFunction
) => {
  next(
    new AppError(
      `${_request.method} is not a valid method on this endpoint`,
      StatusCodes.METHOD_NOT_ALLOWED
    )
  );
};
