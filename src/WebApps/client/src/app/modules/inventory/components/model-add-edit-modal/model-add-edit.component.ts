import { Component, inject, Input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import { isValidField } from "@core/utils/utils";
import { BrandAddEditDirective } from "@modules/inventory/directives/brand-add-edit.directive";
import { InvModelService } from "@modules/inventory/services/inv-model.service";
import { ProductService } from "@modules/inventory/services/product.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToUpperCaseDirective } from "@shared/directives/ui/to-upper-case.directive";


@Component({
  selector: 'app-model-add-edit-modal',
  standalone: true,
  templateUrl: './model-add-edit.component.html',
  imports: [
    FormsModule,
    BrandAddEditDirective,
    ToUpperCaseDirective
  ]
})
export class ModelAddEditComponent {
  @Input() params = {
    idModelo: 0,
    idMarca: 0,
    descripcion: null,
    estado: true
  }
  modal = inject(NgbActiveModal);
  tS = inject(ToasterService);
  productSvc = inject(ProductService)
  invModelSvc = inject(InvModelService)

  btnText = 'Guardar';
  titleModal = signal('Nuevo')

  data = {
    idModelo: 0,
    idMarca: 0,
    descripcion: null,
    estado: true
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
    this.getDataForm()


    this.data = {
      ...this.params
    }

    if (this.params.idModelo > 0) {
      this.btnText = 'Actualizar';
      this.titleModal.set('Editar ')
    }
  }

  private getDataForm() {
    this.productSvc.getDataForm().subscribe(response => {
      this.marcas.set(response.marcas)
    })
  }
  refreshMarca() {
    this.getDataForm()

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

      if (this.data.idModelo > 0) {
        this.invModelSvc.put(this.data.idModelo, this.data).subscribe(this.successReponse)
      }

      if (!(this.data.idModelo > 0)) {
        this.invModelSvc.post(this.data).subscribe(this.successReponse)
      }


    } catch (error) {
      console.log(error)
    }
  }
}
