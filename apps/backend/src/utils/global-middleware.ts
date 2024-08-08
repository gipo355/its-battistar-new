import type { Handler } from 'express';

// import type { UserDocument } from '../mongoloid/user.model';
// import { UserModel } from '../mongoloid/user.model';
// import { generateToken } from '../utils/jwt';
import { catchAsync } from './catch-async';

export const globalMiddleware: Handler = catchAsync(async (req, res, next) => {
    // reset on every request
    req.user = null;

    // provide a fake logged in user for development and create to db
    // if (process.env.NODE_ENV === 'development') {
    //     // TODO: remove this
    //     const fakeUser = {
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         picture: 'https://somedomain.com/somepicture.png',
    //         username: 'johndoe',
    //         password: '123456!Amk', // pragma: allowlist secret
    //     };
    //
    //     let user = await UserModel.findOne({ username: 'johndoe' });
    //     if (!user) {
    //         user = await UserModel.create(fakeUser);
    //     }
    //
    //     const token = generateToken(user);
    //
    //     req.headers.authorization = `Bearer ${token}`;
    //
    //     req.user = user;
    //
    //     console.log(user);
    // }

    next();
});
