import { Type, TSchema } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';

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

/**
 * @description must pass the data schema to the function to stringify the response
 * Do it globally to cache the stringify function on startup
 */
export const stringifyCustomResponseFactory = <T extends TSchema>(T: T) =>
  fastJsonStringify(customResponseSchemaFactory(T));
