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

import { logger } from '../utils/logger';
import {
  handleCastError,
  handleDuplicateError,
  handleJWTexpirationError,
  handleJWTUnauthorized,
  handleValidationError,
} from './errors.service';

export const errorsHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next
) => {
  // assign the vars as spreading the object won't inherit Prototype methods
  // only hasOwnProperty is passed on spread ( message is not )
  // set defaults
  const {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    status = 'error',
    message = 'internal server error',
  } = error;

  // reassign to new object to avoid mutation
  let newError = { statusCode, status, message, ...error };

  if (process.env.NODE_ENV === 'development') {
    logger.error('error', error);

    sendErrorDevelopment(error, newError, response, request);
  } else {
    // console.log('globalErrorController prod');
    // console.log(newErr, 'newErr');
    // console.log(err, 'err');
    // console.log(err.code);
    // console.log(err.name);

    // if it's a wrong ID search
    if (error.name === 'CastError') newError = handleCastError(newError);
    // keyPattern.Name is a prop that exists on duplicate error
    if (error.code === 11_000) newError = handleDuplicateError(newError);

    if (error.name === 'ValidationError')
      newError = handleValidationError(newError);

    if (error.message.startsWith('JsonWebTokenError')) {
      newError = handleJWTUnauthorized(newError);
    }
    if (error.message.startsWith('TokenExpiredError')) {
      newError = handleJWTexpirationError(newError);
    }
    sendErrorProduction(error, newError, request, response);
  }
};
