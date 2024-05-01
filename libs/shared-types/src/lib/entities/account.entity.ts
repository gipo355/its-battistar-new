import { Static, Type } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';
import type mongoose from 'mongoose';

import ajvInstance from '../../utils/ajv';

export enum ELocalStrategy {
  LOCAL = 'LOCAL',
}
export enum ESocialStrategy {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}
export const EStrategy = {
  ...ELocalStrategy,
  ...ESocialStrategy,
};

// json schema, used for validation and serialization
export const accountsSchema = Type.Object({
  id: Type.Optional(Type.String()),
  user: Type.String(),
  active: Type.Boolean(),
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

  email: Type.String({
    format: 'email',
  }),
  primary: Type.Boolean(),
  verified: Type.Boolean(),

  // social
  // strategy: Type.Union(Object.keys(EStrategy).map((k) => Type.Literal(k))),
  strategy: Type.String({
    enum: Object.keys(EStrategy),
  }),
  providerId: Type.Optional(Type.String()),
  providerAccessToken: Type.Optional(Type.String()),

  // local
  password: Type.Optional(Type.String()),
  passwordResetToken: Type.Optional(Type.String()),
  passwordResetExpires: Type.Optional(Type.String({ format: 'date-time' })),
  passwordChangedAt: Type.Optional(Type.String({ format: 'date-time' })),
});

export type TAccount = Static<typeof accountsSchema>;

/**
 * MONGOOSE INTERFACE
 * needed for mongoose as it requires Date type
 * while ajv and fast-json-stringify handle only json natives
 * also, typebox doesn't have object id type
 */
export interface IAccount {
  id?: string; // created by mongoose
  user: string | mongoose.Schema.Types.ObjectId;
  active: boolean;
  createdAt: Date | string; // created by mongoose
  updatedAt: Date | string; // created by mongoose
  deletedAt?: Date | string;

  email: string;
  primary: boolean;
  verified: boolean;

  // social
  strategy: keyof typeof EStrategy;
  providerId?: string;
  providerAccessToken?: string;

  // local
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date; // created by mongoose
  passwordChangedAt?: Date; // created by mongoose
}

/**
 * @description
 * This is a class used to create new accounts objects
 * making sure we have a single source of truth for the schema
 * only input fields are included
 */

// base class for all accounts
class Account {
  user?: string | mongoose.Schema.Types.ObjectId;
  email?: string;
  primary?: boolean;
  verified?: boolean;

  constructor(
    user: string | mongoose.Schema.Types.ObjectId,
    email: string,
    primary: boolean,
    verified?: boolean
  ) {
    this.user = user;
    this.email = email;
    this.primary = primary;
    this.verified = verified;
  }
}

// social account creation
// can choose strat
// can set verified directly
export class SocialAccount extends Account {
  strategy: keyof typeof ESocialStrategy;
  providerId: string;
  providerAccessToken: string;

  constructor(
    strategy: keyof typeof ESocialStrategy,
    providerId: string,
    providerAccessToken: string,
    user: string | mongoose.Schema.Types.ObjectId,
    email: string,
    primary: boolean,
    verified: boolean
  ) {
    super(user, email, primary, verified);
    this.strategy = strategy;
    this.providerId = providerId;
    this.providerAccessToken = providerAccessToken;
  }
}

// local account creation
// sets the strategy to local
// sets the password
export class LocalAccount extends Account {
  strategy = ELocalStrategy.LOCAL;
  password?: string;

  constructor(
    user: string | mongoose.Schema.Types.ObjectId,
    email: string,
    primary: boolean,
    password: string
  ) {
    super(user, email, primary);
    this.password = password;
  }
}

export const stringifyAccount = fastJsonStringify(accountsSchema);

export const validateAccount = ajvInstance.compile(accountsSchema);
