import { CustomResponse } from '@its-battistar/shared-types';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

// import { AppError } from '../../utils/app-error';
// import { catchAsync } from '../../utils/catch-async';

export const logoutHandler: Handler = (_, res) => {
  res.status(StatusCodes.OK).json(
    new CustomResponse<void>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Logged out successfully',
    })
  );
};
