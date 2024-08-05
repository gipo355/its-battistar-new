import { StatusCodes } from 'http-status-codes';

import { UserModel } from '../../mongoloid/user.model';
import { catchAsync } from '../../utils/catch-async';

export const getUsers = catchAsync(async (_req, res) => {
    // retuirn users without password
    const users = await UserModel.find({}, { password: 0, __v: 0 });

    res.status(StatusCodes.OK).json(users);
});
