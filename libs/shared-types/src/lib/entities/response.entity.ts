/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { TSchema } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

// utility function to create a custom response schema for a given data schema
export const customResponseSchemaFactory = <T extends TSchema>(T: T) =>
  Type.Object(
    {
      ok: Type.Boolean(),
      statusCode: Type.Number(),
      message: Type.Optional(Type.String()),
      length: Type.Optional(Type.Number()),
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
    data?: T;
    length?: number;
    message?: string;
    ok: boolean;
    statusCode: number;
  }) {
    this.ok = ok;
    this.statusCode = statusCode;
    this.message = message;
    length && (this.length = length);
    data && (this.data = data);
  }
}
