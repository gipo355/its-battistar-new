import { Static, Type } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';
import type mongoose from 'mongoose';

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

/**
 * @description
 * this is a todo schema that can be used to identify all the todo properties
 * used for validation and serialization
 */
export const todoSchema = Type.Object({
  id: Type.Optional(Type.String()),
  title: Type.String(),
  color: Type.String({
    enum: [...Object.keys(TodoColorOptions)],
  }),
  description: Type.String(),
  dueDate: Type.Optional(
    Type.String({
      format: 'date-time',
    })
  ),
  completed: Type.Boolean(),
  expired: Type.Boolean(),

  user: Type.String(),

  image: Type.Optional(Type.String()),

  createdAt: Type.String({
    format: 'date-time',
  }),
  updatedAt: Type.String({
    format: 'date-time',
  }),
  deletedAt: Type.Optional(
    Type.String({
      format: 'date-time',
    })
  ),
});
export type TTodo = Static<typeof todoSchema>;

/**
 * MONGOOSE INTERFACE
 * requires a date type which ajv does not support
 * so we use this interface to pass to mongoose
 */
export interface ITodo {
  id?: string;

  title: string;

  color: keyof ITodoColorOptions;

  description: string;

  dueDate?: Date;

  completed: boolean;

  expired: boolean;

  user: string | mongoose.Schema.Types.ObjectId;

  image?: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}

/**
 * @description
 * Class to create a new Todo object, only includes props that are required for creation
 * either in the backend or frontend
 */
export class Todo {
  title: string;
  color?: keyof ITodoColorOptions;
  description: string;
  dueDate?: Date;
  image?: string;

  constructor(
    title = '',
    color: keyof ITodoColorOptions = 'default',
    description = '',
    dueDate?: Date,
    image?: string
  ) {
    this.title = title;
    this.color = color;
    this.description = description;
    this.dueDate = dueDate;
    this.image = image;
  }
}

// Utility functions
export const stringifyTodo = fastJsonStringify(todoSchema);

export const validateTodo = ajvInstance.compile(todoSchemaInput);
