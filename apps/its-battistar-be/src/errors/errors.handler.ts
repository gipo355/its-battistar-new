import { ErrorRequestHandler, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

//
// import { logger } from '../utils/logger';
//
// const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
//   logger.error(error);
//
//   next(error);
// };
//
// export const errorHandlers = [errorHandler];
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';

const handleCastError = (error: AppError) => {
  if (error.path && error.value) {
    const message = `invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
  }

  return error;
};

const handleDuplicateError = (error: AppError) => {
  // BUG: keyvalue can be
  // { name: 'test', email: 'test@test' }
  // let message = `invalid name: ${err.keyValue.name} is a duplicate`;
  let message = 'Something went wrong. Please try again later. (code: 17ec2)';
  if (error.keyValue?.email) {
    message = `this email is already in use`;
  }
  if (error.keyValue?.name) {
    message = `this name is already in use`;
  }
  return new AppError(message, 400);
};

const handleValidationError = async (error: AppError) => {
  if (!error.errors) return error;
  const subObjectsArray: Record<string, string>[] = Object.values(error.errors);

  // Promisify the map function
  const errorMessagesArray = await Promise.all(
    subObjectsArray
      // for every key in errors ( price, duration ) return the value of it's name field
      // .map(async ([_, subErrorObject]) => (subErrorObject as any).message)
      .map(({ message }) => message)
  );
  const errorMessages = errorMessagesArray.join('. ');
  return new AppError(`Invalid input data. ${errorMessages}`, 400);
};

const handleJWTexpirationError = () => {
  const message = `Session expired. Please login again.`;
  return new AppError(message, 401);
};

const handleJWTUnauthorized = () => {
  const message = `Something went wrong. Please login or signup`;
  return new AppError(message, 401);
};

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
  /**
   * ## check if error is from frontend or api
   * BELOW DOESN'T WORK
   * REQ.ORIGINALURL IS ALWAYS /API/USERS/LOGIN
   */

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
  response.status(500).json({
    status: 'error',
    message: 'something went wrong!',
  });
};

export const globalErrorController: ErrorRequestHandler = (
  error,
  _request,
  _response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next
) => {
  (async () => {
    // assign the vars as spreading the object won't inherit Prototype methods
    // only hasOwnProperty is passed on spread ( message is not )
    // set defaults
    const {
      statusCode = 500,
      status = 'error',
      message = 'internal server error',
    } = error;
    // reassign to new object to avoid mutation
    let newError = { statusCode, status, message, ...error };

    if (process.env.NODE_ENV === 'development') {
      logger.error('error', error);

      sendErrorDevelopment(error, newError, _res, _request);
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
        newError = await handleValidationError(newError);

      if (error.message.startsWith('JsonWebTokenError')) {
        newError = handleJWTUnauthorized(newError);
      }
      if (error.message.startsWith('TokenExpiredError')) {
        newError = handleJWTexpirationError(newError);
      }
      sendErrorProduction(error, newError, _res, _request);
    }
  })().catch((error) => {
    throw error;
  });
};
