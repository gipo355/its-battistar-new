import type { Handler, NextFunction, Request, Response } from 'express';

export const catchAsync = function catchAsync(
  routeHandlerFunction: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<unknown>
): Handler {
  // we need to return the same function here to avoid calling it on assignment
  return function (request, response, next) {
    routeHandlerFunction(request, response, next).catch((error: unknown) => {
      next(error);
    });
  };
};
