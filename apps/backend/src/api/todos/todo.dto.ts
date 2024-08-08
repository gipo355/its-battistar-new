import {
    IsDate,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import { ITodo } from './todo.entity';

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
