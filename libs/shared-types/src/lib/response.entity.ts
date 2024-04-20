import { Type, Static } from '@sinclair/typebox';

export const responseSchema = Type.Object(
  {
    ok: Type.Boolean(),
    statusCode: Type.Number(),
    message: Type.String(),
  },
  { additionalProperties: false }
);

export type TResponse = Static<typeof responseSchema>;

export class Response implements TResponse {
  ok: boolean;

  statusCode: number;

  message: string;

  constructor(ok: boolean, statusCode: number, message: string) {
    this.ok = ok;
    this.statusCode = statusCode;
    this.message = message;
  }
}
