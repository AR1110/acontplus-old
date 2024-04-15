import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fecha-emision',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './fecha-emision.component.html',
  styles: ``
})
export class FechaEmisionComponent {
  @Input() value = new Date()

  @Output() valueChange = new EventEmitter<Date>(); // Evento para emitir el nuevo valor al componente padre

  onChange() {
    this.valueChange.emit(this.value); // Emitir el nuevo valor al componente padre
  }
}
