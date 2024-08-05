import { catchAsync } from '../../utils/catch-async';

export const getTodos = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('get todos');
});

export const completeTodo = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('complete todo');
});

export const uncompleteTodo = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('uncomplete todo');
});

export const assignTodo = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('assign todo');
});

export const createTodo = catchAsync(async (req, res) => {
    await Promise.reject(new Error('Method not implemented.'));
    res.send('create todo');
});
