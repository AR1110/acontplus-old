import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatDate, setDateWithCurrentTime } from '@core/utils/date.util';

@Component({
  selector: 'app-input-date',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-date.component.html',
  styles: ``,
})
export class InputDateComponent {
  @Input() value: null | Date = new Date();
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<Date>(); // Evento para emitir el nuevo valor al componente padre

  onChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const timeString = inputElement.value;

    let dateObject = setDateWithCurrentTime(formatDate(timeString));

    console.log(dateObject);
    this.valueChange.emit(dateObject); // Emitir el nuevo valor al componente padre
  }
}
