import { AbstractControl, ValidatorFn } from '@angular/forms';

export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (abstractControl: AbstractControl): { [key: string]: any } | null => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ matchValidator: true });
      return { matchValidator: true };
    } else {
      matchingControl?.setErrors(null);
      return null;
    }
  };
}
