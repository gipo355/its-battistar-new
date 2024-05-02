import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import type mongoose from 'mongoose';

// BUG: importing an enum into angular from here breaks the build
export enum ETodoSortByOptions {
  Newest = 'Newest',
  Oldest = 'Oldest',
  Title = 'Title',
  DueDate = 'DueDate',
}
export enum ETodoColorOptions {
  red = 'red',
  blue = 'blue',
  green = 'green',
  yellow = 'yellow',
  pink = 'pink',
  default = 'default',
}

/**
 * @description
 * this schema is used to validate and serialize the input for creating a new todo
 */
export const todoSchemaInput = Type.Object({
  title: Type.String({
    maxLength: 50,
  }),

  description: Type.Optional(
    Type.String({
      maxLength: 300,
    })
  ),

  color: Type.Optional(
    Type.String({
      enum: [...Object.keys(ETodoColorOptions)],
    })
  ),

  dueDate: Type.Optional(
    Type.String({
      format: 'date-time',
    })
  ),

  image: Type.Optional(
    Type.String({
      format: 'uri',
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

  ...todoSchemaInput.properties,

  expired: Type.Boolean(),

  completed: Type.Optional(Type.Boolean()),

  createdAt: Type.String({
    format: 'date-time',
  }),

  updatedAt: Type.String({
    format: 'date-time',
  }),

  user: Type.String(),
});
export type TTodo = Static<typeof todoSchema>;

/**
 * MONGOOSE INTERFACE
 * requires a date type which ajv does not support
 * so we use this interface to pass to mongoose
 */
export interface ITodoInput {
  title: string;
  description: string;
  color: keyof typeof ETodoColorOptions;
  dueDate?: Date;
  image?: string;
}

export interface ITodoInputWithUser extends ITodoInput {
  user: string | mongoose.Schema.Types.ObjectId;
}

export interface ITodo extends ITodoInputWithUser {
  id?: string;

  expired: boolean;

  completed: boolean;

  createdAt: Date;

  updatedAt: Date;
}

/**
 * @description
 * Class to create a new Todo object, only includes props that are required for creation
 * either in the backend or frontend
 */
export class Todo implements ITodoInput {
  title: string;

  description: string;

  color: keyof typeof ETodoColorOptions;

  dueDate?: Date;

  image?: string;

  constructor({
    title,
    color,
    description,
    dueDate,
    image,
  }: {
    title: string;
    color: keyof typeof ETodoColorOptions;
    description: string;
    dueDate?: Date;
    image: string;
  }) {
    this.title = title;
    this.color = color;
    this.description = description;
    this.dueDate = dueDate;
    this.image = image;
  }
}
