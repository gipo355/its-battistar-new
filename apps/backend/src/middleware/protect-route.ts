/* eslint-disable no-magic-numbers */
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../utils/app-error';
import { catchAsync } from '../utils/catch-async';
import { verifyToken } from '../utils/jwt';

export const protectRoute = catchAsync(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new AppError({
            message: 'Missing authorization header',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        throw new AppError({
            message: 'Missing token',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const decoded = verifyToken(token);

    req.user = decoded.user;

    next();
});
