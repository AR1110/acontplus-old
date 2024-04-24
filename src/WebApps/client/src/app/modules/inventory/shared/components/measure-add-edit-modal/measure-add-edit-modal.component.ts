import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';
import { MeasureService } from '@modules/inventory/services/measure.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-measure-add-edit-modal',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './measure-add-edit-modal.component.html',
  styles: ``
})
export class MeasureAddEditModalComponent {
  @Input() data = {
    id: 0,
    descripcion: null
  }
  modal = inject(NgbActiveModal);
  tS = inject(ToasterService);
  measureSvc = inject(MeasureService)

  btnText = 'Guardar';
  titleModal = 'Nueva Medida'

  successReponse = {
    next: (response: any) => {
      hideLoader()
      if (isApiResponse(response)) {
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
      }
    },
    error(error: any) {
      hideLoader()
      console.log(error)
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

      if (this.data.id > 0) {
        this.measureSvc.post(this.data).subscribe(this.successReponse)
      }

      if (!(this.data.id > 0)) {
        this.measureSvc.put(this.data.id, this.data).subscribe(this.successReponse)
      }


    } catch (error) {
      console.log(error)
    }
  }
}
