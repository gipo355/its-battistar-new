import type mongoose from 'mongoose';

import type { IUser } from './user.schema';

export interface ITodoBase {
    completed: boolean;
    expired: boolean;
    id: string;
    title: string;
}

export interface ITodo extends ITodoBase {
    assignedTo?: string;
    createdBy: string;
    dueDate?: string;
}

export interface ITodoMongoose extends ITodoBase {
    assignedTo?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    dueDate?: Date;
}

export interface IPopulatedTodo extends ITodoBase {
    assignedTo?: IUser;
    createdBy: IUser;
    dueDate?: Date;
}
