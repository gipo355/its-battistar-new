import { Static, TSchema, TString, Type } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';

import ajvInstance from '../../utils/ajv';
import { accountsSchema, TAccount } from './account.entity';

export const userSchemaUserInput = Type.Object({
  name: Type.String(),
  email: Type.String({
    format: 'email',
  }),
  avatar: Type.Optional(Type.String()),
});
/**
 * @description
 * this is a user type that can be used to create a new user.
 * used for validation
 */
export type TUserInput = Static<typeof userSchemaUserInput>;

export const safeUserSchema = Type.Object({
  ...userSchemaUserInput.properties,
  id: Type.Optional(Type.String()),
  verified: Type.Boolean(),
});
/**
 * @description
 * this is a safe user schema that can be used to send to the client
 */
export type TSafeUser = Static<typeof safeUserSchema>;

export const userSchema = Type.Object({
  ...safeUserSchema.properties,

  role: Type.String(),

  active: Type.Boolean(),

  createdAt: Type.String({
    format: 'date-time',
  }),

  updatedAt: Type.String({
    format: 'date-time',
  }),

  deletedAt: Type.String({
    format: 'date-time',
  }),

  accounts: Type.Array(accountsSchema),
});

/**
 * @description
 * this is a user schema that can be used to identify all the user properties
 * provided to mongoose
 */
export type TUser = Static<typeof userSchema>;

// HACK: at the moment this is a hack to be able to provide the type to mongoose
// mongoose doesn't support typescript types (date)
export enum ERole {
  SUPER = 'SUPER',
  USER = 'USER',
}

/**
 * @description
 * This is the user interface that can be used to enforce mongoose schema
 */
export interface IUser {
  id?: string;

  name: string;

  email: string;

  role: keyof typeof ERole;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;

  active: boolean;

  verified: boolean;

  accounts: TAccount[];
}

// TODO: mongoose types
// export type TMongooseUser = Models['User'];

// FIXME: can't use this to stringify everything. Must find
// a way to standardize the data
export const stringifyUser = fastJsonStringify(userSchema);

export const validateUser = ajvInstance.compile(userSchemaUserInput);

// NOTE: solve conflict with mongoose data type?
// [https://github.com/sinclairzx81/typebox/issues/2]
export const DateKind = Symbol('DateKind');
export interface TDate extends TSchema {
  type: 'string';
  $static: Date;
  kind: typeof DateKind;
}
export const TypeDate = Type.String({ format: 'date-time' }) as TString | TDate;
