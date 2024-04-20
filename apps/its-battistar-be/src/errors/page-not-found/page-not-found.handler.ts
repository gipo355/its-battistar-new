import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../utils/app-error';

const pageNotFoundController = function pageNotFoundController(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  next(
    new AppError(
      `can't find ${request.originalUrl} on this server!`,
      StatusCodes.NOT_FOUND
    )
  );
};

export { pageNotFoundController };
