import {
  Static,
  // TSchema,
  // TString,
  Type,
} from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';
import type mongoose from 'mongoose';

import ajvInstance from '../../utils/ajv';
import { IAccountSafe } from './account.entity';
import { ITodo } from './todo.entity';

export enum ERole {
  SUPER = 'SUPER',
  USER = 'USER',
}

/**
 * IMP: the schemas must reflect the mongoose schema
 * there must be a single source of truth
 * can't use typbebox schemas for mongoose as it requires Date type and ObjectID
 * which are not used for validation and serialization
 */

/**
 * @description
 * this is a user type that can be used to create a new user.
 * used for validation and serialization
 */
export const userSchemaInput = Type.Object({
  username: Type.String(),
  avatar: Type.Optional(
    Type.String({
      format: 'uri',
    })
  ),
});
export type TUserInput = Static<typeof userSchemaInput>;

/**
 * @description
 * this is a safe user schema that can be used to send to the client
 * includes the id for serialization
 * doesn't include sensitive data
 * we may display the role in the dashboard
 */
export const userSchemaSafe = Type.Object({
  id: Type.Optional(Type.String()),

  role: Type.String({
    enum: Object.keys(ERole),
  }),

  createdAt: Type.String({
    format: 'date-time',
  }),

  updatedAt: Type.String({
    format: 'date-time',
  }),

  ...userSchemaInput.properties,

  accounts: Type.Array(Type.String()),

  todos: Type.Array(Type.String()),
});
export type TUserSafe = Static<typeof userSchemaSafe>;

/**
 * @description
 * this is a user schema that can be used to identify all the user properties
 */
export const userSchema = Type.Object({
  ...userSchemaSafe.properties,

  deletedAt: Type.Optional(
    Type.String({
      format: 'date-time',
    })
  ),
});
export type TUser = Static<typeof userSchema>;

/**
 * MONGOOSE INTERFACE
 * needed for mongoose as it requires Date type and other types that
 * can't be handled by ajv and fast-json-stringify
 * since they only handle json natives
 */

// interface used for typind input
export interface IUserInput {
  username: string;

  avatar?: string;
}

// interface used for typing output
export interface IUserSafe extends IUserInput {
  id?: string | mongoose.Schema.Types.ObjectId; // created by mongoose

  createdAt: Date; // created by mongoose

  updatedAt: Date; // created by mongoose

  role: keyof typeof ERole;

  // needed to type interface when populating client side
  todos?: string[] | mongoose.Schema.Types.ObjectId[] | ITodo; // created by mongoose

  accounts?: string[] | mongoose.Schema.Types.ObjectId[] | IAccountSafe[]; // created by mongoose
}

// interface used for full user
export interface IUser extends IUserSafe {
  deletedAt?: Date;
}

/**
 * @description
 * This is a class used to create new User objects
 * only includes props that are required for creation
 * NOTE: this is used only server side, no user input
 */
export class User {
  username: string;
  avatar?: string;
  role: keyof typeof ERole;

  constructor(user: IUserSafe) {
    this.username = user.username;
    this.avatar = user.avatar;
    this.role = user.role;
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
