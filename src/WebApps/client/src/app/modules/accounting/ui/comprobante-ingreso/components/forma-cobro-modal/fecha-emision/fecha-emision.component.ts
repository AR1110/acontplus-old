import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@core/utils/date.util';

@Component({
  selector: 'app-fecha-emision',
  imports: [CommonModule, FormsModule],
  templateUrl: './fecha-emision.component.html',
  styles: ``,
})
export class FechaEmisionComponent {
  @Input() value = new Date();

  @Output() valueChange = new EventEmitter<Date>(); // Evento para emitir el nuevo valor al componente padre

  onChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const timeString = inputElement.value;

    const dateObject = formatDate(timeString);

    this.valueChange.emit(dateObject); // Emitir el nuevo valor al componente padre
  }
}
