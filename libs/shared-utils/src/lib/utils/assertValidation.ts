import type { ErrorObject, ValidateFunction } from 'ajv';
import type { Logger } from 'pino';

export function assertAjvValidationOrThrow<T>(
  data: unknown,
  validatorFN: ValidateFunction,
  // this callback gives access to validatorFN.errors
  errorCB: (err: ErrorObject[] | null | undefined) => void,
  logger?: Logger
): asserts data is T {
  const isValid = validatorFN(data);

  if (!isValid) {
    logger?.error({
      data,
      errors: validatorFN.errors,
    });

    errorCB(validatorFN.errors);
  }
}
