import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTimeInputFormat]',
})
export class TimeInputFormat24Directive {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    let value = input.value;

    // Remover caracteres no permitidos
    value = value.replace(/[^0-9]/g, '');

    // Asegurar que no se ingrese más de 4 caracteres (HHMM)
    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    // Formatear el valor en HH:MM
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue += value.slice(0, 2); // HH
    }
    if (value.length > 2) {
      formattedValue += ':' + value.slice(2); // :MM
    }

    // Validar horas y minutos
    const [hours, minutes] = formattedValue.split(':');
    if (hours && parseInt(hours, 10) > 23) {
      formattedValue = '23' + (minutes ? ':' + minutes : '');
    }
    if (minutes && parseInt(minutes, 10) > 59) {
      formattedValue = hours + ':59';
    }

    // Evitar bucle infinito: solo actualizar si el valor ha cambiado
    if (input.value !== formattedValue) {
      input.value = formattedValue;
      // Emitir el nuevo valor solo si se ha cambiado el valor
      input.dispatchEvent(new Event('input'));
    }
  }
}
