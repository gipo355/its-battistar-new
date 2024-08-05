import { validate, ValidationError } from 'class-validator';
import { timingSafeEqual } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { UserModel } from '../../mongoloid/user.model';
import type { LoginDTO, LoginResponse } from '../../schemas/auth.schema';
import { RegisterDTO } from '../../schemas/auth.schema';
import type { IUser } from '../../schemas/user.schema';
import { AppError } from '../../utils/app-error';
import { catchAsync } from '../../utils/catch-async';
import { generateToken } from '../../utils/jwt';

export const login = catchAsync(async (req, res) => {
    const { username, password } = req.body as {
        password: string | undefined;
        username: string | undefined;
    };

    if (!username || !password) {
        throw new AppError({
            message: 'Missing username or password',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    const user = await UserModel.findOne({ username });

    // WARN: timing attack + info leak + no rateLimit
    // very bad implementation of a login endpoint for fake exam
    if (!user) {
        throw new AppError({
            message: 'User not found',
            code: StatusCodes.NOT_FOUND,
        });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new AppError({
            message: 'Invalid username or password',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    const token = generateToken(user);

    const loginResponse: LoginResponse = {
        user: {
            id: user.id as string,
            firstName: user.firstName,
            fullName: user.fullName,
            lastName: user.lastName,
            picture: user.picture,
        },
        token,
    };

    res.status(StatusCodes.OK).json(loginResponse);
});

export const register = catchAsync(async (req, res) => {
    const { firstName, lastName, picture, username, password } = req.body as {
        firstName: string | undefined;
        lastName: string | undefined;
        password: string | undefined;
        picture: string | undefined;
        username: string | undefined;
    };

    const userDto = new RegisterDTO({
        firstName,
        lastName,
        picture,
        username,
        password,
    });

    const errors = await validate(userDto);

    if (errors.length) {
        const details: Record<string, unknown> = {};
        for (const error of errors) {
            if (error instanceof ValidationError) {
                details[error.property] = error.constraints;
            }
        }

        throw new AppError({
            message: 'Validation error',
            code: StatusCodes.BAD_REQUEST,
            details,
        });
    }

    try {
        const user = await UserModel.create(userDto);
        const response: IUser = {
            id: user.id as string,
            firstName: user.firstName,
            fullName: user.fullName,
            lastName: user.lastName,
            picture: user.picture,
        };

        res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        if (error instanceof Error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new AppError({
                    message: error.message,
                    code: StatusCodes.BAD_REQUEST,
                    details: error.errors,
                });
            }

            throw new AppError({
                message: 'Error creating user',
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                details: {
                    // WARN: info leak, handle shitty mongoose throws
                    error: error.message,
                },
                unknownError: true,
                cause: error,
            });
        }

        throw new AppError({
            message: 'Error creating user',
            code: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
});
