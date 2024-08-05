import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import { TodoModel } from '../../mongoloid/todo.model';
import { TodoDTO } from '../../schemas/todo.schema';
import { AppError } from '../../utils/app-error';
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
        assignedTo: string | undefined;
        dueDate: string;
        title: string;
    };

    const currUser = req.user;
    if (!currUser) {
        throw new AppError({
            message: 'Unauthorized',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const todo = new TodoDTO({
        title,
        dueDate,
        assignedTo: assignedTo ? assignedTo : currUser.id,
        createdBy: currUser.id,
    });
    const errors = await validate(todo);

    if (errors.length) {
        const details: Record<string, unknown> = {};
        for (const error of errors) {
            if (error instanceof ValidationError) {
                details[error.property] = error.constraints;
            }
        }

        throw new AppError({
            message: 'Validation error',
            code: StatusCodes.BAD_REQUEST,
            details,
        });
    }

    const createdTodo = new TodoModel(todo);
    await createdTodo.save();

    const populatedTodo = await TodoModel.findById(createdTodo.id)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName fullName picture',
        })
        .populate({
            path: 'assignedTo',
            select: 'firstName lastName fullName picture',
        })
        .exec();

    res.status(StatusCodes.CREATED).json(populatedTodo);
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
