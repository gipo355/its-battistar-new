import type { User } from './user.schema';

export interface TodoBase {
    completed: boolean;
    dueDate?: string;
    expired: boolean;
    id: string;
    title: string;
}

export interface Todo extends TodoBase {
    assignedTo?: string;
    createdBy: string;
}

export interface PopulatedTodo extends TodoBase {
    assignedTo?: User;
    createdBy: User;
}
