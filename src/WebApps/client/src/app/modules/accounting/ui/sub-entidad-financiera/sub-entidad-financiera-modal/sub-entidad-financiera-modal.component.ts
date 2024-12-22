import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, inject, Input } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isApiResponse } from '@core/models/api-response';
import {SubEntidadFinancieraUseCase} from "@accounting/core/use-cases/sub-entidad-financiera.use-case";


@Component({
    selector: "app-sub-entidad-financiera-modal",
    templateUrl: './sub-entidad-financiera-modal.component.html',
    imports: [
        ReactiveFormsModule,
        FormsModule
    ]
})
export class SubEntidadFinancieraModalComponent {

  modal = inject(NgbActiveModal);

  tS = inject(ToasterService);
  private useCase = inject(SubEntidadFinancieraUseCase)

  @Input() params = {
    idEntidadFinanciera: 0,
    nameEntidadFinanciera: '',
    idSubEntidadFinanciera: 0,
    descripcion: '',
    codigo: '',
    controlCaja: false,
    estado: false
  }

  titleModal = 'Nuevo SubEntidad Financiera';
  btnText = 'Guardar';

  dataForm = new FormGroup({
    idEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idSubEntidadFinanciera: new FormControl(0),
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    controlCaja: new FormControl(false),
    estado: new FormControl(false),
    interes: new FormControl(0)
  });

  greaterThanZeroValidator(control: AbstractControl<number>): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { lessThanZero: true }; // Validation failed
    }
    return null; // Validation passed
  }


  ngOnInit() {
    this.dataForm.get("idEntidadFinanciera")?.setValue(this.params.idEntidadFinanciera);
    if (this.params.idSubEntidadFinanciera > 0) {
      this.dataForm.get("idSubEntidadFinanciera")?.setValue(this.params.idSubEntidadFinanciera);
      this.dataForm.get("codigo")?.setValue(this.params.codigo);
      this.dataForm.get("descripcion")?.setValue(this.params.descripcion);
      this.dataForm.get("controlCaja")?.setValue(this.params.controlCaja);
      this.dataForm.get("estado")?.setValue(this.params.estado);
      this.titleModal = 'Editar SubEntidad Financiera';
      this.btnText = 'Actualizar';
    }
  }

  onChangeDescripcion() {
    const descripcion = this.dataForm.value.descripcion || '';
    if (isValidField(descripcion)) {
      this.dataForm.get('codigo')?.setValue(descripcion.slice(0, 3))
    }
  }

  save() {
    try {
      if (this.dataForm.invalid) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!'
        })
        return
      }
      const data = this.dataForm.value;


      if (!(this.params.idSubEntidadFinanciera > 0)) {

        showLoader();
        this.useCase.create(data).subscribe({
          next: (response) => {
            hideLoader();
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
          error(err) {
            hideLoader();
            console.log(err)
          },
        })
      }

      if (this.params.idSubEntidadFinanciera > 0) {
        showLoader();
        this.useCase.update(this.params.idSubEntidadFinanciera, data).subscribe({
          next: (response) => {
            hideLoader();
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
          error(err) {
            hideLoader();
            console.log(err)
          },
        })
      }
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }

}
