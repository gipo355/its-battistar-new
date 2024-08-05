import type { Handler } from 'express';

import { UserModel } from '../mongoloid/user.model';
import { catchAsync } from '../utils/catch-async';
import { generateToken } from '../utils/jwt';

export const globalMiddleware: Handler = catchAsync(async (req, res, next) => {
    req.user = null;

    // provide a fake logged in user for development and create to db
    if (process.env.NODE_ENV === 'development') {
        // TODO: remove this
        const fakeUser = {
            firstName: 'John',
            lastName: 'Doe',
            picture: 'https://somedomain.com/somepicture.png',
            username: 'johndoe',
            password: '123456!Amk', // pragma: allowlist secret
        };

        const user = await UserModel.create(fakeUser);

        const token = generateToken(user);

        req.headers.authorization = `Bearer ${token}`;

        req.user = user;

        console.log(user);
    }

    next();
});
