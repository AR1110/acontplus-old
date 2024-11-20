import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { TagsService } from '@modules/inventory/services/tags.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { M3InputChipComponent } from '@shared/components/m3-input-chip/m3-input-chip.component';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

@Component({
    selector: 'app-tags-add-edit-modal',
    imports: [
        FormsModule,
        ToUpperCaseDirective,
        M3InputChipComponent
    ],
    templateUrl: './tags-add-edit-modal.component.html',
    styles: ``
})
export class TagsAddEditModalComponent {
  @Input() params = {
    idEtiqueta: 0,
    descripcion: null,
    estado: true,
    etiquetas: ''
  }
  modal = inject(NgbActiveModal);
  tS = inject(ToasterService);
  tagsSvc = inject(TagsService)

  btnText = 'Guardar';
  titleModal = signal('Nuevo')

  etiquetas: string[] = []

  data = {
    idEtiqueta: 0,
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


    this.data = {
      ...this.params
    }

    if (this.params.idEtiqueta > 0) {
      this.btnText = 'Actualizar';
      this.titleModal.set('Editar ')
      this.etiquetas = this.params.etiquetas.split(';') || []
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

      if (this.etiquetas.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese al menos una etiqueta'
        })
        return
      }

      const data = {
        descripcion: this.data.descripcion,
        estado: this.data.estado,
        etiquetas: this.etiquetas.join(':'),
      }


      if (this.data.idEtiqueta > 0) {
        this.tagsSvc.put(this.data.idEtiqueta, data).subscribe(this.successReponse)
      }else{
        this.tagsSvc.post(data).subscribe(this.successReponse)

      }


    } catch (error) {
      console.log(error)
    }
  }
}
