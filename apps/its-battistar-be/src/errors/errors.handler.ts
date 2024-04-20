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
import { ErrorRequestHandler, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';
import {
  handleCastError,
  handleDuplicateError,
  handleJWTexpirationError,
  handleJWTUnauthorized,
  handleValidationError,
} from './errors.service';

const sendErrorDevelopment = (
  error: Error,
  newError: AppError,
  response: Response,
  request: Request
) => {
  /**
   * ## check if error is from frontend or api
   */
  if (request.originalUrl.startsWith('/api')) {
    logger.error(newError);
    return response.status(newError.statusCode).json({
      status: newError.status,
      stack: error.stack,
      originalError: error,
      newError: newError,
      message: newError.message,
    });
  }

  // ! OPERATIONAL ERROR, TRUSTED, result of AppError
  response.status(newError.statusCode).render('error', {
    title: 'Uh Oh! Something went wrong!',
    message: JSON.stringify({ ...newError, ...error }),
    code: newError.statusCode,
  });
};

const sendErrorProduction = (
  _error: Error,
  newError: AppError,
  response: Response
) => {
  if (newError.isOperationalError) {
    // ! OPERATIONAL ERROR, TRUSTED, result of AppError
    response.status(newError.statusCode).json({
      status: newError.status,
      message: newError.message,
    });
    return;
  }

  // ! UNKNOWN ERROR, PROGRAMMING BUG, CAN'T LEAK DETAILS TO CLIENT
  // LOG to keep track of unknown behavior
  logger.error({
    timeStamp: Date.now(),
    status: newError.status,
    stack: _error.stack,
    originalError: _error,
    newError: newError,
    message: newError.message,
  });

  // NOTE: console.log is bad but usually available in hosting platforms

  // send generic message
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'something went wrong!',
  });
};

export const errorsHandler: ErrorRequestHandler = (
  error,
  _request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _response,
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

    return sendErrorDevelopment(error, newError, _response, _request);
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
    sendErrorProduction(error, newError, _response, _request);
  }
};
