import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-decimal-select',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './decimal-select.component.html',
})
export class DecimalSelectComponent {
  label = input('');
  @Input() value = 2; // Valor inicial predeterminado
  readonly decimales = new Array(6)
    .fill(0)
    .map((_, index) => index + 1)
    .splice(1);

  @Output() valueChange = new EventEmitter<number>(); // Evento para emitir el nuevo valor al componente padre

  onChange() {
    this.valueChange.emit(this.value); // Emitir el nuevo valor al componente padre
  }
}
