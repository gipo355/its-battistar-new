// NOTE: console.log is bad but usually available in hosting platforms

// battistar way
// import { logger } from '../utils/logger';
//
// const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
//   logger.error(error);
//
//   next(error);
// };
//
// export const errorHandlers = [errorHandler];

// import {
//   CustomResponse,
// stringifyCustomResponseFactory,
// } from '@its-battistar/shared-types';
import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { e } from '../environment';
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';
import {
  handleCastError,
  handleDuplicateError,
  handleJWTexpirationError,
  handleJWTUnauthorized,
  handleValidationError,
  sendErrorDevelopment,
  sendErrorProduction,
} from './errors.service';

export const errorsHandler: ErrorRequestHandler = (
  error: AppError,
  request,
  response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next
) => {
  // FIXME: this code is a mess of mutations and reassignments
  // and prototype inheritance loss

  // the error we receive CAN be an instance of AppError or a generic express error
  // or an exception thrown by anything we caught in catchAsync

  // Check if its an instance of AppError
  // if it is, we know it's an operational error and send it to the client

  // assign the vars as spreading the object won't inherit Prototype methods
  // only hasOwnProperty is passed on spread ( message is not )
  // set defaults
  const {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    status = 'error',
    message = 'internal server error',
  } = error;

  // reassign to new object to avoid mutation, or we lose the stack
  let newError = { statusCode, status, message, ...error };

  if (e.NODE_ENV === 'development') {
    logger.error('error', error);
    return sendErrorDevelopment(error, newError, response, request);
  }

  // if it's a wrong ID search
  if (error.name === 'CastError') newError = handleCastError(newError);
  // keyPattern.Name is a prop that exists on duplicate error
  if (error.code === 11_000) newError = handleDuplicateError(newError);

  if (error.name === 'ValidationError')
    newError = handleValidationError(newError);

  if (error.message.startsWith('JsonWebTokenError')) {
    newError = handleJWTUnauthorized();
  }
  if (error.message.startsWith('TokenExpiredError')) {
    newError = handleJWTexpirationError();
  }
  sendErrorProduction(error, newError, request, response);
};
