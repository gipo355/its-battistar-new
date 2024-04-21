import { Type, Static } from '@sinclair/typebox';

export const accountsSchema = Type.Object({
  id: Type.Optional(Type.String()),

  UserId: Type.String(),

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

export interface IAccount {}
