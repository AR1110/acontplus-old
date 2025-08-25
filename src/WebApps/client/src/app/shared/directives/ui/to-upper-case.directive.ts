import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appToUpperCase]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToUpperCaseDirective,
      multi: true,
    },
  ],
})
export class ToUpperCaseDirective implements ControlValueAccessor {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('input') onInput() {
    const value = this.el.nativeElement.value;
    this.el.nativeElement.value = value.toUpperCase();
    this.onChange(value.toUpperCase()); // Llamar a la función que actualiza el valor del modelo
  }

  // Funciones de ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    if (value) {
      this.el.nativeElement.value = value.toUpperCase();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
