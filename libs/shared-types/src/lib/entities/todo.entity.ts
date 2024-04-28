import { Static, Type } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';

import ajvInstance from '../../utils/ajv';

// TODO: fix this type mess, must be able to:
// 1- define mongoose schema
// 2- validate user input with ajv
// 3- stringify the object to be sent to the client with fast-json-stringify
// 4- be used in the backend and frontend to type the object
// 5- instantiate a new object with the class
//
// same for user.entity.ts and account.entity.ts

// test comment for nx dep-graph affected

export interface ITodoColorOptions {
  red: 'red';
  blue: 'blue';
  green: 'green';
  yellow: 'yellow';
  pink: 'pink';
  default: 'default';
}

export interface ITodoSortByOptions {
  Newest: 'Newest';
  Oldest: 'Oldest';
  Title: 'Title';
  DueDate: 'DueDate';
}

// BUG: can't import from shared-types into angular real values, only types
export const TodoColorOptions: ITodoColorOptions = {
  red: 'red',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  pink: 'pink',
  default: 'default',
} as const;

// BUG: can't import from shared-types into angular real values, only types
// const TodoSortByOptions: TodoSortBy = {
//   Newest: 'Newest',
//   Oldest: 'Oldest',
//   Title: 'Title',
//   DueDate: 'Due Date',
// };

// Required different schema for input and strict schema
// we need to validate against the input schema
export const todoSchemaInput = Type.Object({
  title: Type.String(),
  completed: Type.Optional(Type.Boolean()),
  color: Type.Optional(
    Type.String({
      enum: [...Object.keys(TodoColorOptions)],
    })
  ),
  description: Type.Optional(Type.String()),
  dueDate: Type.Optional(
    Type.String({
      format: 'date-time',
    })
  ),
});
export type TTodoInput = Static<typeof todoSchemaInput>;

export const todoSchema = Type.Object({
  title: Type.String(),
  completed: Type.Boolean(),
  dueDate: Type.String({
    format: 'date-time',
  }),
  expired: Type.Boolean(),
  createdAt: Type.String({
    format: 'date-time',
  }),
  updatedAt: Type.String({
    format: 'date-time',
  }),
});

export const hello = 'hello';

export type TTodo = Static<typeof todoSchema>;

// MONGOOSE requires a date type which ajv does not support
// so we use this interface to pass to mongoose
export interface ITodo {
  id?: string;

  title: string;

  color?: keyof ITodoColorOptions;

  description: string;

  dueDate?: Date;

  completed: boolean;

  expired: boolean;

  createdAt: Date;

  updatedAt: Date;
}

// Tried with a class, to be able to instantiate a new Todo
// export class Todo {
//   id?: string;
//
//   title: string;
//
//   dueDate: string;
//
//   completed = false;
//
//   createdAt = new Date().toISOString();
//
//   updatedAt = new Date().toISOString();
//
//   constructor({ title, dueDate }: { title: string; dueDate: string }) {
//     this.title = title;
//     this.dueDate = dueDate;
//   }
//
//   get expired(): boolean {
//     return Date.now() > new Date(this.dueDate).getTime();
//   }
// }

export const stringifyTodo = fastJsonStringify(todoSchema);

export const validateTodo = ajvInstance.compile(todoSchemaInput);
