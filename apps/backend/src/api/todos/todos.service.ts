import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { isMongoId } from 'validator';

import { AppError } from '../../utils/app-error';
import { catchAsync } from '../../utils/catch-async';
import { UserModel } from '../users/user.model';
import { TodoDTO } from './todo.entity';
import { TodoModel } from './todo.model';

export const getTodos = catchAsync(async (req, res) => {
    const currUser = req.user;
    if (!currUser) {
        throw new AppError({
            message: 'Unauthorized',
            code: StatusCodes.UNAUTHORIZED,
        });
    }

    const { showCompleted } = req.query as {
        showCompleted: boolean | undefined;
    };

    // WARN: aggregate doesn't provide virtual fields by default
    // https://github.com/Automattic/mongoose/issues/8345

    // const todos = await TodoModel.aggregate([
    //     {
    //         $match: {
    //             $or: [
    //                 { createdBy: new mongoose.Types.ObjectId(currUser.id) },
    //                 { assignedTo: new mongoose.Types.ObjectId(currUser.id) },
    //             ],
    //             ...(showCompleted ? {} : { completed: false }),
    //         },
    //     },
    //     {
    //         $addFields: {
    //             dueDateExists: {
    //                 $cond: {
    //                     if: { $ifNull: ['$dueDate', false] },
    //                     then: 1,
    //                     else: 0,
    //                 },
    //             },
    //         },
    //     },
    //     {
    //         $sort: {
    //             dueDateExists: -1, // Items with dueDate come first
    //             dueDate: 1, // Sort by dueDate ascending
    //             createdAt: 1, // Sort by createdAt for items without dueDate
    //         },
    //     },
    //     {
    //         $lookup: {
    //             from: 'users',
    //             localField: 'createdBy',
    //             foreignField: '_id',
    //             as: 'createdBy',
    //         },
    //     },
    //     {
    //         $unwind: '$createdBy',
    //     },
    //     {
    //         $lookup: {
    //             from: 'users',
    //             localField: 'assignedTo',
    //             foreignField: '_id',
    //             as: 'assignedTo',
    //         },
    //     },
    //     {
    //         $unwind: '$assignedTo',
    //     },
    //     {
    //         $addFields: {
    //             expired: {
    //                 $cond: {
    //                     if: { $ifNull: ['$dueDate', false] },
    //                     then: { $lt: ['$dueDate', new Date()] },
    //                     else: false,
    //                 },
    //             },
    //             'createdBy.fullName': {
    //                 $concat: [
    //                     '$createdBy.firstName',
    //                     ' ',
    //                     '$createdBy.lastName',
    //                 ],
    //             },
    //             'assignedTo.fullName': {
    //                 $concat: [
    //                     '$assignedTo.firstName',
    //                     ' ',
    //                     '$assignedTo.lastName',
    //                 ],
    //             },
    //         },
    //     },
    //     {
    //         $project: {
    //             dueDate: 1,
    //             completed: 1,
    //             expired: 1,
    //             title: 1,
    //             createdAt: 1,
    //             'createdBy.firstName': 1,
    //             'createdBy.lastName': 1,
    //             'createdBy.fullName': 1,
    //             'createdBy.picture': 1,
    //             'assignedTo.firstName': 1,
    //             'assignedTo.lastName': 1,
    //             'assignedTo.fullName': 1,
    //             'assignedTo.picture': 1,
    //         },
    //     },
    // ]).exec();
    const todos = await TodoModel.aggregate([
        {
            $match: {
                $or: [
                    { createdBy: new mongoose.Types.ObjectId(currUser.id) },
                    { assignedTo: new mongoose.Types.ObjectId(currUser.id) },
                    {
                        $and: [
                            {
                                createdBy: new mongoose.Types.ObjectId(
                                    currUser.id
                                ),
                            },
                            {
                                $or: [
                                    { assignedTo: { $exists: false } },
                                    { assignedTo: null },
                                ],
                            },
                        ],
                    },
                ],
                ...(showCompleted ? {} : { completed: false }),
            },
        },
        {
            $addFields: {
                dueDateExists: {
                    $cond: {
                        if: { $ifNull: ['$dueDate', false] },
                        then: 1,
                        else: 0,
                    },
                },
            },
        },
        {
            $sort: {
                dueDateExists: -1, // Items with dueDate come first
                dueDate: 1, // Sort by dueDate ascending
                createdAt: 1, // Sort by createdAt for items without dueDate
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
            },
        },
        {
            $unwind: '$createdBy',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo',
            },
        },
        {
            $unwind: {
                path: '$assignedTo',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                expired: {
                    $cond: {
                        if: { $ifNull: ['$dueDate', false] },
                        then: { $lt: ['$dueDate', new Date()] },
                        else: false,
                    },
                },
                'createdBy.fullName': {
                    $concat: [
                        '$createdBy.firstName',
                        ' ',
                        '$createdBy.lastName',
                    ],
                },
                'assignedTo.fullName': {
                    $concat: [
                        '$assignedTo.firstName',
                        ' ',
                        '$assignedTo.lastName',
                    ],
                },
            },
        },
        {
            $project: {
                dueDate: 1,
                completed: 1,
                expired: 1,
                title: 1,
                createdAt: 1,
                'createdBy.id': 1,
                'createdBy._id': 1,
                'createdBy.firstName': 1,
                'createdBy.lastName': 1,
                'createdBy.fullName': 1,
                'createdBy.picture': 1,
                'assignedTo.id': 1,
                'assignedTo._id': 1,
                'assignedTo.firstName': 1,
                'assignedTo.lastName': 1,
                'assignedTo.fullName': 1,
                'assignedTo.picture': 1,
            },
        },
    ]).exec();

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
        assignedTo: string | undefined;
        dueDate: string | undefined;
        title: string;
    };

    const todo = new TodoDTO({
        title,
        dueDate,
        assignedTo,
        createdBy: currUser.id,
    });
    const errors = await validate(todo);

    console.log(todo);

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

    if (assignedTo) {
        const assignedUser = await UserModel.findById(assignedTo);

        if (!assignedUser) {
            throw new AppError({
                message: 'Invalid assigned user',
                code: StatusCodes.BAD_REQUEST,
            });
        }
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

export const deleteTodo = catchAsync(async (req, res) => {
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
            message: 'You do not have permission to delete this todo',
            code: StatusCodes.NOT_FOUND,
        });
    }

    await TodoModel.deleteOne({ _id: id });

    res.status(StatusCodes.NO_CONTENT).json();
});
