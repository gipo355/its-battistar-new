import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const redisSessionPayloadSchema = Type.Object({
  ip: Type.Optional(Type.String()),
  userAgent: Type.Optional(Type.String()),
  user: Type.Optional(Type.String()),
});

export type TRedisSessionPayload = Static<typeof redisSessionPayloadSchema>;
