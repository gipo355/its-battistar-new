import type { NextFunction, Request, Response } from 'express';

export const catchAsync = function catchAsync(
  routeHandlerFunction: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<unknown>
) {
  // we need to return the same function here to avoid calling it on assignment
  return function (request: Request, response: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
    routeHandlerFunction(request, response, next).catch(next);
  };
};
