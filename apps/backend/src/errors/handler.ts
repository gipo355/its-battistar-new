import type { ErrorRequestHandler } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { AppError } from '../utils/app-error';
import { ErrorMessage } from '../utils/error-message';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        if (err.code && err.reason) {
            const e = new ErrorMessage({
                message: err.message,
                status: err.code,
                error: err.reason,
                details: err.details,
            });

            res.status(err.code).send(e);
            return;
        }
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
        new ErrorMessage({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        })
    );
};
