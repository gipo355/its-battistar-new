import { catchAsync } from '../../utils/catch-async';

export const getUsers = catchAsync(async (_req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('get users');
});
