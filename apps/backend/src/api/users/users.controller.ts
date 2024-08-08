import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '../../utils/catch-async';
import { UserModel } from './user.model';

export const getUsers = catchAsync(async (_req, res) => {
    // retuirn users without password
    const users = await UserModel.find({}, { password: 0, __v: 0 });

    res.status(StatusCodes.OK).json(users);
});
