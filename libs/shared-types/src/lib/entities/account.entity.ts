import { Static, Type } from '@sinclair/typebox';
import type mongoose from 'mongoose';

export enum EStrategy {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export const accountsSchema = Type.Object({
  id: Type.Optional(Type.String()),

  User: Type.String(),

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

  strategy: Type.Union(Object.keys(EStrategy).map((k) => Type.Literal(k))),

  // TODO: use those here for multiple emails per user?
  email: Type.Optional(Type.String()),
  providerId: Type.String(),
  accessToken: Type.Optional(Type.String()),
  refreshToken: Type.Optional(Type.String()),

  password: Type.Optional(Type.String()),
  passwordConfirm: Type.Optional(Type.String()),
  passwordResetToken: Type.Optional(Type.String()),
  passwordResetExpires: Type.Optional(Type.String({ format: 'date-time' })),
  passwordChangedAt: Type.Optional(Type.String({ format: 'date-time' })),
});

// NOTE: session, refreshToken, accessToken, etc. are redis specific

export type TAccount = Static<typeof accountsSchema>;

/**
 * needed for mongoose as it requires Date type
 */
export interface IAccount {
  id?: string;
  user: string | mongoose.Schema.Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  strategy: keyof typeof EStrategy;
  providerId?: string;

  // TODO: use those?
  email: string;
  accessToken?: string;
  refreshToken?: string;

  password?: string;
  passwordConfirm?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
}
