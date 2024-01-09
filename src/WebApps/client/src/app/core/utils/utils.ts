export const isValidField = <T>(field: T): T | null => {
  const invalidValues: ReadonlyArray<T | null | undefined | "" | 0> = ["", null, undefined, 0];

  return invalidValues.includes(field) ? null : field;
};
