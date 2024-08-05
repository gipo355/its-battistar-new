import { TodoModel } from '../../mongoloid/todo.model';
import { catchAsync } from '../../utils/catch-async';

export const getTodos = catchAsync(async (req, res) => {
    const { showCompleted } = req.query as {
        showCompleted: boolean | undefined;
    };

    const todos = await TodoModel.find({
        completed: showCompleted ? undefined : false,
    })
        .populate('createdBy', ['firstName', 'lastName', 'fullName', 'picture'])
        .populate('assignedTo', [
            'firstName',
            'lastName',
            'fullName',
            'picture',
        ])
        .exec();

    res.json(todos);
});

export const createTodo = catchAsync(async (req, res) => {
    const { title, dueDate, assignedTo } = req.body as {
        assignedTo: string;
        dueDate: string;
        title: string;
    };

    res.send('create todo');
});

export const completeTodo = catchAsync(async (req, res) => {
    const { id } = req.params;

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
