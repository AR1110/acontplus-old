import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banco-select',
  imports: [FormsModule],
  templateUrl: './banco-select.component.html',
  styles: ``,
})
export class BancoSelectComponent {
  @Input() value = 0;
  @Input() bancos: any[] = [];

  @Output() valueChange = new EventEmitter<number>(); // Evento para emitir el nuevo valor al componente padre

  onChange() {
    this.valueChange.emit(this.value); // Emitir el nuevo valor al componente padre
  }
}
