/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { TSchema } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const customResponseSchemaFactory = <T extends TSchema>(T: T) =>
  Type.Object(
    {
      ok: Type.Boolean(),
      statusCode: Type.Number(),
      message: Type.Optional(Type.String()),
      data: Type.Optional(T),
    },
    { additionalProperties: false }
  );

export class CustomResponse<T> {
  ok: boolean;

  statusCode: number;

  message?: string;

  length?: number;

  data?: T;

  constructor({
    ok,
    statusCode,
    message,
    length,
    data,
  }: {
    ok: boolean;
    statusCode: number;
    message?: string;
    length?: number;
    data?: T;
  }) {
    this.ok = ok;
    this.statusCode = statusCode;
    this.message = message;
    length && (this.length = length);
    this.data = data;
  }
}
