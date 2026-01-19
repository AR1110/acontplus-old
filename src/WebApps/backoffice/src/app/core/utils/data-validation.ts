import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isNonEmptyArray(obj: any): boolean {
  return Array.isArray(obj) && obj.length > 0;
}

export const isValidField = <T>(field: T): T | null => {
  let value: any = field;
  if (typeof field === 'string') {
    value = field.trim();
  }
  const invalidValues: ReadonlyArray<T | null | undefined | '' | 0> = [
    '',
    null,
    undefined,
    0,
  ];

  return invalidValues.includes(value) ? null : value;
};

export function notZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value && control.value !== 0 ? null : { notZero: true };
  };
}


export const getValidId =  (id?: number) => {
  if (typeof id === "number" && id > 0) return id  ;  // Retorna id como T

  if (id === undefined) return undefined;
  return null;
}
