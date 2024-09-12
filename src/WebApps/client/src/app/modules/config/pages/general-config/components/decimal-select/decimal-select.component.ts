import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-decimal-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './decimal-select.component.html'
})
export class DecimalSelectComponent {

  @Input() value: number = 2; // Valor inicial predeterminado
  readonly decimales = new Array(6).fill(0).map((_, index)=>index + 1).splice(1)

  @Output() valueChange = new EventEmitter<number>(); // Evento para emitir el nuevo valor al componente padre

  onChange() {
    this.valueChange.emit(this.value); // Emitir el nuevo valor al componente padre
  }
}
