import type { ErrorRequestHandler } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { AppError } from './app-error';
import { ErrorMessage } from './error-message';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    if (err instanceof AppError) {
        res.status(err.code).json(
            new ErrorMessage({
                message: err.message,
                status: err.code,
                error: err.reason,
                ...(err.details ? { details: err.details } : {}),
            })
        );
        return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        new ErrorMessage({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        })
    );
};
