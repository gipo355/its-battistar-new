import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { isMongoId } from 'validator';

import { TodoModel } from '../../mongoloid/todo.model';
import { UserModel } from '../../mongoloid/user.model';
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
    const currUser = req.user;
    if (!currUser) {
        throw new AppError({
            message: 'Unauthorized',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const { title, dueDate, assignedTo } = req.body as {
        assignedTo: string;
        dueDate: string;
        title: string;
    };

    const assignedUser = await UserModel.findById(assignedTo);

    if (!assignedUser) {
        throw new AppError({
            message: 'Invalid assigned user',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    const todo = new TodoDTO({
        title,
        dueDate,
        assignedTo,
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
    const currUser = req.user;
    if (!currUser) {
        throw new AppError({
            message: 'Unauthorized',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const { id } = req.params;
    if (!isMongoId(id)) {
        throw new AppError({
            message: 'Invalid id, must be a valid mongo id',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    const todo = await TodoModel.findById(id);

    if (!todo) {
        throw new AppError({
            message: 'Todo not found',
            code: StatusCodes.NOT_FOUND,
        });
    }

    if (todo.createdBy.toString() !== currUser.id) {
        throw new AppError({
            message: 'You do not have permission to complete this todo',
            code: StatusCodes.NOT_FOUND,
        });
    }

    if (todo.completed) {
        throw new AppError({
            message: 'Todo already completed',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    todo.completed = true;
    await todo.save();

    const populatedTodo = await TodoModel.findById(id)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName fullName picture',
        })
        .populate({
            path: 'assignedTo',
            select: 'firstName lastName fullName picture',
        })
        .exec();

    res.status(StatusCodes.OK).json(populatedTodo);
});

export const uncompleteTodo = catchAsync(async (req, res) => {
    const currUser = req.user;
    if (!currUser) {
        throw new AppError({
            message: 'Unauthorized',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const { id } = req.params;
    if (!isMongoId(id)) {
        throw new AppError({
            message: 'Invalid id, must be a valid mongo id',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    const todo = await TodoModel.findById(id);

    if (!todo) {
        throw new AppError({
            message: 'Todo not found',
            code: StatusCodes.NOT_FOUND,
        });
    }

    if (todo.createdBy.toString() !== currUser.id) {
        throw new AppError({
            message: 'You do not have permission to uncomplete this todo',
            code: StatusCodes.NOT_FOUND,
        });
    }

    if (!todo.completed) {
        throw new AppError({
            message: 'Todo not completed',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    todo.completed = false;
    await todo.save();

    const populatedTodo = await TodoModel.findById(id)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName fullName picture',
        })
        .populate({
            path: 'assignedTo',
            select: 'firstName lastName fullName picture',
        })
        .exec();

    res.status(StatusCodes.OK).json(populatedTodo);
});

export const assignTodo = catchAsync(async (req, res) => {
    const currUser = req.user;
    if (!currUser) {
        throw new AppError({
            message: 'Unauthorized',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const { id } = req.params;
    const { userId } = req.body as {
        userId: string;
    };

    if (!isMongoId(id)) {
        throw new AppError({
            message: 'Invalid id, must be a valid mongo id',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    if (!isMongoId(userId)) {
        throw new AppError({
            message: 'Invalid user id, must be a valid mongo id',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new AppError({
            message: 'User not found',
            code: StatusCodes.BAD_REQUEST,
        });
    }

    const todo = await TodoModel.findById(id);

    if (!todo) {
        throw new AppError({
            message: 'Todo not found',
            code: StatusCodes.NOT_FOUND,
        });
    }

    if (todo.createdBy.toString() !== currUser.id) {
        throw new AppError({
            message: 'You do not have permission to assign this todo',
            code: StatusCodes.NOT_FOUND,
        });
    }

    todo.assignedTo = new mongoose.Types.ObjectId(userId);

    await todo.save();

    const populatedTodo = await TodoModel.findById(id)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName fullName picture',
        })
        .populate({
            path: 'assignedTo',
            select: 'firstName lastName fullName picture',
        })
        .exec();

    res.status(StatusCodes.OK).json(populatedTodo);
});
