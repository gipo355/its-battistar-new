import {
    IsDate,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
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

export class TodoDTO {
    @IsString()
    @IsNotEmpty()
    title?: string;
    @IsOptional()
    @IsDate()
    dueDate?: Date;
    @IsOptional()
    assignedTo?: string;
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
        if (dueDate) {
            this.dueDate = new Date(dueDate);
        }
        if (assignedTo) {
            this.assignedTo = assignedTo;
        }
        this.createdBy = createdBy;
    }
}
