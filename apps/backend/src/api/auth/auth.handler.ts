import { catchAsync } from '../../utils/catch-async';

export const login = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('login');
});

export const register = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('register');
});
