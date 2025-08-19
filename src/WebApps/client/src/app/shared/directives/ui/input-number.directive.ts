import { Directive, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appInputNumber]',
})
export class InputNumberDirective {
  constructor(private ngModel: NgModel) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    let clean = value.replace(/[^-0-9\.]/g, '');
    const negativeCheck = clean.split('-');
    const decimalCheck = clean.split('.');

    if (negativeCheck[1] !== undefined) {
      negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
      clean = negativeCheck[0] + '-' + negativeCheck[1];
      if (negativeCheck[0].length > 0) {
        clean = negativeCheck[0];
      }
    }

    if (decimalCheck[1] !== undefined) {
      decimalCheck[1] = decimalCheck[1].slice(0, 5);
      clean = decimalCheck[0] + '.' + decimalCheck[1];
    }

    if (value !== clean) {
      this.ngModel?.valueAccessor?.writeValue(clean);
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }
}
