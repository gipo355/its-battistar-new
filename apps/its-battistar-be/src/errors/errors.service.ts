import { StatusCodes } from 'http-status-codes';

import { AppError } from '../utils/app-error';

export const handleValidationError = (error: AppError) => {
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

export const handleCastError = (error: AppError) => {
  if (error.path && error.value) {
    const message = `invalid ${error.path}: ${error.value}`;
    return new AppError(message, StatusCodes.BAD_REQUEST);
  }

  return error;
};

export const handleDuplicateError = (error: AppError) => {
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
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

export const handleJWTexpirationError = () => {
  const message = `Session expired. Please login again.`;
  return new AppError(message, StatusCodes.UNAUTHORIZED);
};

export const handleJWTUnauthorized = () => {
  const message = `Something went wrong. Please login or signup`;
  return new AppError(message, StatusCodes.UNAUTHORIZED);
};
