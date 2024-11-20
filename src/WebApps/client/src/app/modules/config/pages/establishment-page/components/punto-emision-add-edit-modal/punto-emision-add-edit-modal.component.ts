import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { PuntoEmisionService } from '@modules/config/services/sri/punto-emision.service';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { InputNumberDirective } from '@shared/directives/ui/input-number.directive';

@Component({
    selector: 'app-punto-emision-add-edit-modal',
    imports: [
        CommonModule,
        InputNumberDirective,
        FormsModule
    ],
    templateUrl: './punto-emision-add-edit-modal.component.html',
    styleUrl: './punto-emision-add-edit-modal.component.scss'
})
export class PuntoEmisionAddEditModalComponent {
  @Input() params = {
    codEstab: null,
    establishmentName: '',
    idPuntoEmision: 0,
    estado: false,
    ptoEmi: '',
    ambiente: "1"
  }
  modal = inject(NgbActiveModal)
  tS = inject(ToasterService)
  ptoEmisionSvc = inject(PuntoEmisionService)

  tiposAmbiente = [
    { code: "1", description: 'Pruebas' },
    { code: "2", description: 'Producción' },
  ]

  titleModal = 'Nuevo Punto Emisión'
  btnText = 'Guardar';

  data = {
    ptoEmi: '',
    ambiente: "1",
    estado: true
  }
  successResponse = {
    next: (response: any) => {
      if (isApiResponse(response)) {
        if (response.code == "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code == "1") {
          this.tS.toastr({
            type: 'success',
            message: response.message
          })
          this.modal.close(response)
        }
      }
    }
  }

  ngOnInit() {
    console.log(this.params)
    if (this.params.idPuntoEmision > 0) {
      this.titleModal = 'Editar Punto Emisión'
      this.btnText = 'Actualizar'
      this.data.estado = this.params.estado;
      this.data.ptoEmi = this.params.ptoEmi;
      this.data.ambiente = this.params.ambiente
    }
  }


  save() {
    try {
      if (isNaN(parseFloat(this.data.ptoEmi))) {
        this.tS.toastr({
          type: 'warning',
          message: 'El punto de emisión tiene que ser número'
        })
        return
      }

      if (isValidField(this.data.ptoEmi) && this.data.ptoEmi?.length !== 3) {
        this.tS.toastr({
          type: 'warning',
          message: 'El punto de emisión es requerido'
        })
        return
      }

      const regex = /^\d{3}$/;
      if(!regex.test(this.data.ptoEmi)){
        this.tS.toastr({
          type: 'warning',
          message: 'El punto de emisión tiene que ser de tres dígitos'
        })
        return
      }
      let params = {
        codEstab: this.params.codEstab,
        ptoEmi: this.data.ptoEmi,
        ambiente: this.data.ambiente,
        estado: this.data.estado
      }
      if (!(this.params.idPuntoEmision > 0)) {
        this.ptoEmisionSvc.post(params).subscribe(this.successResponse)
      }

      if (this.params.idPuntoEmision > 0) {
        this.ptoEmisionSvc.put(this.params.idPuntoEmision, params).subscribe(this.successResponse)
      }
    } catch (error) {

      console.log(error)
    }
  }

}
