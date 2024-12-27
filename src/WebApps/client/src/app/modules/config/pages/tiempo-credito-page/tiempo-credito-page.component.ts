import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { TiempoCredito } from '@modules/config/models/tiempo-credito.model';

@Component({
    selector: 'app-tiempo-credito-page',
    imports: [CommonModule, FormsModule ],
    templateUrl: './tiempo-credito-page.component.html',
    styles: ``
})
export class TiempoCreditoPageComponent {
  buscar: string = '';
  tiempoCreditos: TiempoCredito[] = []; // Populate this with your data
  filteredCreditos: TiempoCredito[] = [];
  accion = { editar: true, eliminar: true }; // Your action

  ngOnInit() {
    this.filteredCreditos = this.tiempoCreditos;
  }

  openModal(item: any) {
    // Your logic to open a modal
  }

  // get filteredCreditos() {
  //   return this.tiempoCreditos.filter((credito) =>
  //     credito.descripcion.toLowerCase().includes(this.buscar.toLowerCase()),
  //   );

  askToDelete(item: any) {
    // Your logic to handle deletion
  }
}
