import {
  Static,
  // TSchema,
  // TString,
  Type,
} from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';
import type mongoose from 'mongoose';

import ajvInstance from '../../utils/ajv';

export enum ERole {
  SUPER = 'SUPER',
  USER = 'USER',
}

/**
 * @description
 * this is a user type that can be used to create a new user.
 * used for validation and serialization
 */
export const userSchemaInput = Type.Object({
  username: Type.String(),
  avatar: Type.Optional(Type.String()),
});
export type TUserInput = Static<typeof userSchemaInput>;

/**
 * @description
 * this is a safe user schema that can be used to send to the client
 * includes the id for serialization
 * doesn't include sensitive data
 */
export const userSchemaResponse = Type.Object({
  id: Type.Optional(Type.String()),
  ...userSchemaInput.properties,
});
export type TSafeUser = Static<typeof userSchemaResponse>;

/**
 * @description
 * this is a user schema that can be used to identify all the user properties
 */
export const userSchema = Type.Object({
  ...userSchemaResponse.properties,

  role: Type.String({
    enum: Object.keys(ERole),
  }),

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

  accounts: Type.Array(Type.String()),

  todos: Type.Array(Type.String()),
});
export type TUser = Static<typeof userSchema>;

/**
 * MONGOOSE INTERFACE
 * needed for mongoose as it requires Date type and other types that
 * can't be handled by ajv and fast-json-stringify
 * since they only handle json natives
 */
export interface IUser {
  id?: string | mongoose.Schema.Types.ObjectId; // created by mongoose
  username: string;
  avatar?: string;
  role: keyof typeof ERole;

  createdAt: Date; // created by mongoose
  updatedAt: Date; // created by mongoose
  deletedAt?: Date;

  todos: string[] | mongoose.Schema.Types.ObjectId[]; // created by mongoose

  accounts: string[] | mongoose.Schema.Types.ObjectId[]; // created by mongoose
}

/**
 * @description
 * This is a class used to create new Todo objects
 * only includes props that are required for creation
 */
export class User {
  username?: string;
  avatar?: string;
  role?: keyof typeof ERole;

  constructor(user: Partial<IUser>) {
    user.username && (this.username = user.username);
    user.avatar && (this.avatar = user.avatar);
    user.role && (this.role = user.role);
  }
}

// TODO: fix validation for different use cases and data types
export const stringifyUser = fastJsonStringify(userSchema);

export const validateUser = ajvInstance.compile(userSchemaInput);

// NOTE: solve conflict with mongoose data type?
// [https://github.com/sinclairzx81/typebox/issues/2]
// export const DateKind = Symbol('DateKind');
// export interface TDate extends TSchema {
//   type: 'string';
//   $static: Date;
//   kind: typeof DateKind;
// }
// export const TypeDate = Type.String({ format: 'date-time' }) as TString | TDate;
