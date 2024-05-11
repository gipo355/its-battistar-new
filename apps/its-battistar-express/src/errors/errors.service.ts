import { CustomResponse } from '@its-battistar/shared-types';
// import {
//   CustomResponse,
// stringifyCustomResponseFactory,
// } from '@its-battistar/shared-types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';

export const handleValidationError = (error: AppError): AppError => {
  if (!error.errors) return error;
  const subObjectsArray: Record<string, string>[] = Object.values(error.errors);

  // Promisify the map function
  const errorMessagesArray = subObjectsArray
    // for every key in errors ( price, duration ) return the value of it's name field
    // .map(async ([_, subErrorObject]) => (subErrorObject as any).message)
    .map(({ message }) => message);
  const errorMessages = errorMessagesArray.join('. ');
  return new AppError(
    `Invalid input data. ${errorMessages}`,
    StatusCodes.BAD_REQUEST
  );
};

export const handleCastError = (error: AppError): AppError => {
  if (error.path && error.value) {
    const message = `invalid ${error.path}: ${error.value}`;
    return new AppError(message, StatusCodes.BAD_REQUEST);
  }

  return error;
};

export const handleDuplicateError = (error: AppError): AppError => {
  let message = 'Something went wrong. Please try again later. (code: 17ec2)';
  if (error.keyValue?.email) {
    message = `this email is already in use`;
  }
  if (error.keyValue?.name) {
    message = `this name is already in use`;
  }
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

export const handleJWTexpirationError = (): AppError => {
  const message = `Session expired. Please login again.`;
  return new AppError(message, StatusCodes.UNAUTHORIZED);
};

export const handleJWTUnauthorized = (): AppError => {
  const message = `Something went wrong. Please login or signup`;
  return new AppError(message, StatusCodes.UNAUTHORIZED);
};

interface DevelopmentResponseData {
  message: string;
  newError: Error;
  originalError: Error;
  stack: Error['stack'];
  status: 'error' | 'success' | 'fail';
}

export const sendErrorDevelopment = (
  error: Error,
  newError: AppError,
  response: Response,
  // need 4 params for express to recognize it as an error handler (bad express design)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request: Request
): void => {
  logger.error(newError);

  response
    .status(newError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      new CustomResponse<DevelopmentResponseData>({
        ok: false,
        statusCode: newError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        message: newError.message,
        data: {
          status: newError.status ?? 'error',
          stack: error.stack,
          originalError: error,
          newError: newError,
          message: newError.message,
        },
      })
    );
  return;
};

export const sendErrorProduction = (
  error: Error,
  newError: AppError,
  request: Request,
  response: Response
): void => {
  const statusCode = newError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  if (newError.isOperationalError) {
    // ! OPERATIONAL ERROR, TRUSTED, result of AppError
    // response.status(newError.statusCode).json({
    //   status: newError.status,
    //   message: newError.message,
    // });

    response.status(statusCode).json(
      new CustomResponse({
        ok: false,
        statusCode,
        message: newError.message,
      })
    );
    return;
  }

  // ! UNKNOWN ERROR, PROGRAMMING BUG, CAN'T LEAK DETAILS TO CLIENT
  // LOG to keep track of unknown behavior
  logger.error({
    request: request.id,
    timeStamp: Date.now(),
    status: newError.status,
    stack: error.stack,
    originalError: error,
    newError: newError,
    message: newError.message,
  });

  // send generic message
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    new CustomResponse({
      ok: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    })
  );
};
