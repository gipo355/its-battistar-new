import { protectRoute } from '../../middleware/protect-route';
import { catchAsync } from '../../utils/catch-async';
import r from './users.router';

r.use(protectRoute);

export const getUsers = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('get users');
});
