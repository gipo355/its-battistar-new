import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../utils/app-error';

export const pageNotFoundHandler: Handler = function pageNotFoundController(
  request,
  _response,
  next
) {
  next(
    new AppError(
      `can't find ${request.originalUrl} on this server!`,
      StatusCodes.NOT_FOUND
    )
  );
};
