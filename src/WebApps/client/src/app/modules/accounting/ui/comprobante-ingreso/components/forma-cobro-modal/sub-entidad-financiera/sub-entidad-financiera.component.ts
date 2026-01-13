import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sub-entidad-financiera-page',
  imports: [FormsModule],
  templateUrl: './sub-entidad-financiera.component.html',
  styles: ``,
})
export class SubEntidadFinancieraComponent {
  @Input() value = 0;
  @Input() subEntidadesFinanciera: any[] = [];

  @Output() valueChange = new EventEmitter<number>(); // Evento para emitir el nuevo valor al componente padre

  onChange() {
    this.valueChange.emit(this.value); // Emitir el nuevo valor al componente padre
  }
}
