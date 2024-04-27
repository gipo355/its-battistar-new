import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

// import { AppError } from '../../utils/app-error';
// import { catchAsync } from '../../utils/catch-async';

export const refreshHandler: Handler = (_, res) => {
  const data = {
    token: '1234567890',
  };

  res.status(StatusCodes.OK).json(
    new CustomResponse<typeof data>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Refreshed token successfully',
      data,
    })
  );
};
