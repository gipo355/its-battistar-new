import { IsDate, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import type mongoose from 'mongoose';

import type { IUser } from './user.schema';

export interface ITodoBase {
    completed: boolean;
    expired: boolean;
    id: string;
    title: string;
}

export interface ITodo extends ITodoBase {
    assignedTo: string;
    createdBy: string;
    dueDate: string;
}

export interface ITodoMongoose extends ITodoBase {
    assignedTo: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    dueDate: Date;
}

export interface IPopulatedTodo extends ITodoBase {
    assignedTo?: IUser;
    createdBy: IUser;
    dueDate?: Date;
}

export class TodoDTO {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsDate()
    @IsNotEmpty()
    dueDate: Date;
    @IsMongoId()
    @IsNotEmpty()
    assignedTo: string;
    @IsMongoId()
    @IsNotEmpty()
    createdBy: string;
    completed = false;
    picture = 'https://somedomain.com/somepicture.png';

    constructor({
        title,
        dueDate,
        assignedTo,
        createdBy,
    }: Pick<ITodo, 'title' | 'dueDate' | 'assignedTo' | 'createdBy'>) {
        this.title = title;
        this.dueDate = new Date(dueDate);
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
    }
}
