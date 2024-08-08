import type mongoose from 'mongoose';

import type { IUser } from '../users/user.entity';

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
    assignedTo: mongoose.Types.ObjectId;
    createdAt: Date;
    createdBy: mongoose.Types.ObjectId;
    dueDate?: Date;
}

export interface IPopulatedTodo extends ITodoBase {
    assignedTo?: IUser;
    createdBy: IUser;
    dueDate?: Date;
}
