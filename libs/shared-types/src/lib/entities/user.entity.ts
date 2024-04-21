import { Static, TSchema, TString, Type } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';

import ajvInstance from '../../utils/ajv';
import { accountsSchema, TAccount } from './account.entity';

export const userSchemaUserInput = Type.Object({
  name: Type.String(),
  email: Type.Boolean(),
});

export const userSchema = Type.Object({
  ...userSchemaUserInput.properties,

  id: Type.Optional(Type.String()),

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

  verified: Type.Boolean(),

  accounts: Type.Array(accountsSchema),
});

export type TUser = Static<typeof userSchema>;

export interface IUser {
  id?: string;

  name: string;

  email: string;

  role: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;

  active: boolean;

  verified: boolean;

  accounts: TAccount[];
}

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
