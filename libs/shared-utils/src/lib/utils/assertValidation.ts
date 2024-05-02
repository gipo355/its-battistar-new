export function assertAjvValidationOrThrow<T>(
  data: unknown,
  validatorFN: (data: unknown) => boolean,
  error: Error
): asserts data is T {
  if (!validatorFN(data)) {
    {
      throw error;
    }
  }
}
