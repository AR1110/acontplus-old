import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { TarifaService } from '@modules/inventory/services/tarifa.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

@Component({
  selector: 'app-tarifa-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    ToUpperCaseDirective
  ],
  templateUrl: './tarifa-edit-modal.component.html',
  styles: ``
})
export class TarifaEditModalComponent {
  @Input() params = {
    idTarifa: 0,
    codigo: null,
    descripcion: null,
    estado: true,
    ventaPorMayor: false
  }
  modal = inject(NgbActiveModal);
  tS = inject(ToasterService);
  tarifaSvc = inject(TarifaService)

  btnText = 'Actualizar';
  titleModal = signal('Editar')

  data = {
    idTarifa: 0,
    codigo: null,
    descripcion: null,
    estado: true,
    ventaPorMayor: false
  }

  marcas = signal<any[]>([])

  successReponse = {
    next: (response: ApiResponse) => {

      if (response.code === "0") {
        this.tS.toastr({
          type: 'warning',
          message: response.message
        })
      }
      if (response.code === "1") {
        this.tS.toastr({
          type: 'success',
          message: response.message
        })
        this.modal.close(response)
      }

    },
    error(error: any) {
      console.log(error)
    }
  }

  ngOnInit() {
    this.data = {
      ...this.params
    }

  }


  save() {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la descripción'
        })
        return
      }

      if (!isValidField(this.data.codigo)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la código'
        })
        return
      }


      this.tarifaSvc.put(this.data.idTarifa, this.data).subscribe(this.successReponse)



    } catch (error) {
      console.log(error)
    }
  }
}
