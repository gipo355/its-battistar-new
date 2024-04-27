import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

// import { AppError } from '../../utils/app-error';
// import { catchAsync } from '../../utils/catch-async';

// NOTE: will probably be handler by a dependency
export const googleCallbackHandler: Handler = (_, res) => {
  res.status(StatusCodes.OK).json(
    new CustomResponse<void>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Hello',
    })
  );
};
