/* eslint-disable no-magic-numbers */
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../app-error';
import { catchAsync } from '../catch-async';
import { verifyToken } from './jwt';

export const protectRoute = catchAsync(async (req, res, next) => {
    // WARN: bad implementation of client side auth for fake exam
    // browser clients shouldn't send the token in the header, it should be sent in http only cookies together with a csrf token with revocation, whitelisting, rotation and low lifespan
    // programmatic authentication can be done in header or urlencoded params with longer token lifetime
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

    // WARN: bad implementation of a token verification for fake exam
    // no rate limit, weak token security params, no algo verification, no revocation logic, long token lifetime and more
    const decoded = verifyToken(token);

    req.user = decoded.user;

    next();
});
