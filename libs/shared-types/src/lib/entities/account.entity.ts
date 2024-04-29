import { Static, Type } from '@sinclair/typebox';
import type mongoose from 'mongoose';

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

  strategy: Type.Union([
    Type.Literal('local'),
    Type.Literal('google'),
    Type.Literal('facebook'),
    Type.Literal('twitter'),
    Type.Literal('github'),
  ]),

  providerId: Type.String(),

  password: Type.Optional(Type.String()),
  passwordConfirm: Type.Optional(Type.String()),
  passwordResetToken: Type.Optional(Type.String()),
  passwordResetExpires: Type.Optional(Type.String({ format: 'date-time' })),
  passwordChangedAt: Type.Optional(Type.String({ format: 'date-time' })),
});

// NOTE: session, refreshToken, accessToken, etc. are redis specific

export type TAccount = Static<typeof accountsSchema>;

export enum EStrategy {
  LOCAL = 'local',
  GOOGLE = 'google',
}

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
  password?: string;
  passwordConfirm?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  passwordChangedAt?: Date;
}
