import type { ValidateFunction } from 'ajv';
import type { Logger } from 'pino';

export function assertAjvValidationOrThrow<T>(
  data: unknown,
  validatorFN: ValidateFunction,
  error: Error,
  logger?: Logger
): asserts data is T {
  const isValid = validatorFN(data);
  if (!isValid) {
    logger?.error({
      message: error.message,
      data,
      errors: validatorFN.errors,
    });

    throw error;
  }
}
