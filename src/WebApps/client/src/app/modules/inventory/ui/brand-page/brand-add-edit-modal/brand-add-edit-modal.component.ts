import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import { isValidField } from "@core/utils/utils";
import { IbrandService } from "@inventory/services/ibrand.service";
import { BrandService } from "@technical-support/services/brand.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToUpperCaseDirective } from "@shared/directives/ui/to-upper-case.directive";


@Component({
    selector: 'app-brand-add-edit-modal',
    templateUrl: './brand-add-edit-modal.component.html',
    imports: [
        FormsModule,
        ToUpperCaseDirective
    ]
})
export class BrandAddEditModalComponent {
  @Input() params = {
    idMarca: 0,
    descripcion: null
  }
  modal = inject(NgbActiveModal);
  tS = inject(ToasterService);
  brandSvc = inject(IbrandService)

  btnText = 'Guardar';
  titleModal = 'Nueva Marca'

  data = {
    idMarca: 0,
    descripcion: null
  }

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

    if (this.params.idMarca > 0) {
      this.btnText = 'Actualizar';
      this.titleModal = 'Editar Marca'
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

      if (this.data.idMarca > 0) {
        this.brandSvc.put(this.data.idMarca, this.data).subscribe(this.successReponse)
      }

      if (!(this.data.idMarca > 0)) {
        this.brandSvc.post(this.data).subscribe(this.successReponse)
      }


    } catch (error) {
      console.log(error)
    }
  }
}
