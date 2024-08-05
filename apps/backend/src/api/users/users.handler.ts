import { StatusCodes } from 'http-status-codes';

import { UserModel } from '../../mongoloid/user.model';
import { catchAsync } from '../../utils/catch-async';

export const getUsers = catchAsync(async (_req, res) => {
    const users = await UserModel.find({});

    res.status(StatusCodes.OK).json(users);
});
