import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import type mongoose from 'mongoose';

export enum ELocalStrategy {
  LOCAL = 'LOCAL',
}

export enum ESocialStrategy {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
}

export const EStrategy = {
  ...ELocalStrategy,
  ...ESocialStrategy,
};

/**
 * IMP: the schemas must reflect the mongoose schema
 * there must be a single source of truth
 * can't use typbebox schemas for mongoose as it requires Date type and ObjectID
 * which are not used for validation and serialization
 */

/**
 * @description
 * this is an account schema that can be used to create a new account.
 * used for validation and serialization for local strategy
 */
export const accountSchemaInput = Type.Object({
  email: Type.String({
    format: 'email',
  }),
  password: Type.Optional(Type.String()),
});
export type TLocalAccountInput = Static<typeof accountSchemaInput>;

/**
 * @description
 * this is an account schema that can be used to display info to the client
 * and doesn't include sensitive data
 */
export const accountSchemaSafe = Type.Object({
  id: Type.Optional(Type.String()),

  email: Type.String({
    format: 'email',
  }),

  primary: Type.Boolean(),

  verified: Type.Boolean(),

  strategy: Type.String({
    enum: Object.keys(EStrategy),
  }),

  createdAt: Type.String({
    format: 'date-time',
  }),

  updatedAt: Type.String({
    format: 'date-time',
  }),
});
export type TAccountSafe = Static<typeof accountSchemaSafe>;

/**
 * this is an account schema that can be used to identify all the account properties
 */
export const accountSchema = Type.Object({
  ...accountSchemaSafe.properties,
  user: Type.String(),
  active: Type.Boolean(),
  deletedAt: Type.Optional(
    Type.String({
      format: 'date-time',
    })
  ),

  providerId: Type.Optional(Type.String()),
  providerAccessToken: Type.Optional(Type.String()),

  // local
  password: Type.Optional(Type.String()),
  passwordResetToken: Type.Optional(Type.String()),
  passwordResetExpires: Type.Optional(Type.String({ format: 'date-time' })),
  passwordChangedAt: Type.Optional(Type.String({ format: 'date-time' })),
});
export type TAccount = Static<typeof accountSchema>;

/**
 * MONGOOSE AND JS INTERFACES with javascript specific types
 * needed for mongoose as it requires Date type
 * while ajv and fast-json-stringify handle only json natives
 * also, typebox doesn't have object id type
 */

/**
 * safe to display interface
 */
export interface IAccountSafe {
  createdAt: Date | string; // created by mongoose
  email: string;
  id?: string;
  primary: boolean;
  strategy: keyof typeof EStrategy;
  updatedAt: Date | string;
  verified: boolean;
}

/**
 * full account interface
 */
export interface IAccount extends IAccountSafe {
  active: boolean;
  deletedAt?: Date | string;
  // local
  password?: string;

  // created by mongoose
  passwordChangedAt?: Date;
  passwordResetExpires?: Date;

  passwordResetToken?: string;
  providerAccessToken?: string;
  // social
  providerId?: string;
  user: string | mongoose.Schema.Types.ObjectId; // created by mongoose
}

/**
 * @description
 * The classes below are used to create new accounts objects
 * making sure we have a single source of truth for the schema
 * only input fields are included
 */

// base class for all accounts with props shared
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

  constructor({
    strategy,
    providerId,
    providerAccessToken,
    user,
    email,
    primary,
    verified,
  }: {
    email: string;
    primary: boolean;
    providerAccessToken: string;
    providerId: string;
    strategy: keyof typeof ESocialStrategy;
    user: string | mongoose.Schema.Types.ObjectId;
    verified: boolean;
  }) {
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

  constructor({
    user,
    email,
    primary,
    password,
  }: {
    email: string;
    password: string;
    primary: boolean;
    user: string | mongoose.Schema.Types.ObjectId;
  }) {
    super(user, email, primary);
    this.password = password;
  }
}
