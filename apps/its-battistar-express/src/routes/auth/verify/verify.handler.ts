import { CustomResponse } from '@its-battistar/shared-types';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * verify handler for email verification
 * and password reset
 */
export const verifyHandler: Handler = (_, res) => {
  res.status(StatusCodes.OK).json(
    new CustomResponse<string>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Refreshed token successfully',
      data: 'Hello from verifyHandler',
    })
  );
};
