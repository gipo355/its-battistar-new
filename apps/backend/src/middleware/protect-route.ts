import { catchAsync } from '../utils/catch-async';

export const protectRoute = catchAsync(async (req, res, next) => {
    await Promise.reject(new Error('Method not implemented.'));
    next();
});
