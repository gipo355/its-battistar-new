import { StatusCodes } from 'http-status-codes';
import { sign, verify } from 'jsonwebtoken';

import type { IUser } from '../schemas/user.schema';
import { AppError } from './app-error';

const SECRET = 'secret';

export const generateToken = (user: IUser): string => {
    const token = sign({ user }, SECRET, {
        expiresIn: '7d',
    });

    return token;
};

export const verifyToken = (token: string): { user: IUser } => {
    try {
        const decoded = verify(token, SECRET);
        if (!decoded) {
            throw new AppError({
                message: 'Invalid token',
                code: StatusCodes.UNAUTHORIZED,
            });
        }

        return decoded as {
            user: IUser;
        };
    } catch (error) {
        throw new AppError({
            message: 'Invalid token',
            code: StatusCodes.UNAUTHORIZED,
        });
    }
};
