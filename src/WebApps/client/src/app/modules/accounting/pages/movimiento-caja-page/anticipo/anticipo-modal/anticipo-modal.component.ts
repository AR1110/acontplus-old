import { data } from 'jquery';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { hideLoader, showLoader } from '@core/utils/loader';
import { AnticipoService } from '@modules/accounting/services/anticipo.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { EntidadFinanciera } from '@modules/accounting/models/entidad-financiera.model';
import { SubEntidadFinanciera } from '@modules/accounting/models/subentidad-financiera.model';
import { ToasterService } from '@core/services/toaster.service';
import { isApiResponse } from '@core/models/api-response';

@Component({
  selector: 'app-anticipo-modal',
  standalone: true,
  imports: [AppModule, AccountingModule],
  templateUrl: './anticipo-modal.component.html',
  styles: ``
})
export class AnticipoModalComponent {
  private activeModal = inject(NgbActiveModal);
  private anticipoSvc = inject(AnticipoService)
  private tS = inject(ToasterService)

  textBtn = 'Guardar';
  iconBtn = 'save';

  isSearchSimpleCompanyCustomer = true;

  private tempSubEntidadesFinanciera: Array<SubEntidadFinanciera> = [];
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  entidadesFinanciera: Array<EntidadFinanciera> = [];
  subEntidadesFinanciera: Array<SubEntidadFinanciera> = [];

  dataForm = new FormGroup({
    idCliente: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    codEstab: new FormControl('', Validators.required),
    idEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idSubEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    valor: new FormControl(0, Validators.required),
    observaciones: new FormControl(''),
  });

  greaterThanZeroValidator(control: AbstractControl<number>): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { lessThanZero: true }; // Validation failed
    }
    return null; // Validation passed
  }

  ngOnInit() {
    showLoader();
    this.anticipoSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader();
        let { establecimientos, entidadesFinanciera, subEntidadesFinanciera } = response;

        this.establecimientos = establecimientos;
        const dataEstab = this.establecimientos.find(estab => estab.predeterminado);
        if (dataEstab) {
          this.dataForm.get("codEstab")?.setValue(dataEstab.codEstab)
        }
        this.entidadesFinanciera = entidadesFinanciera;
        this.tempSubEntidadesFinanciera = subEntidadesFinanciera;
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }
  onCustomerSelected<T extends { data: any }>(result: T) {
    let { data } = result;
    this.dataForm.get('idCliente')?.setValue(data.idCliente)

  }


  onChangeEntidadFinanciera() {
    let idEntidadFinanciera = this.dataForm.value.idEntidadFinanciera;
    if (idEntidadFinanciera) {
      this.subEntidadesFinanciera = this.tempSubEntidadesFinanciera.filter(ef => ef.idEntidadFinanciera === idEntidadFinanciera);
    }
  }


  save() {
    try {
      console.log(this.dataForm)
      if (this.dataForm.invalid) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!'
        })
        return
      }
      const params = this.dataForm.value;


      if (Number(params.valor) === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'El valor tiene que ser mayor a 0!'
        })
        return
      }


      showLoader();
      this.anticipoSvc.post(params).subscribe({
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
              this.activeModal.close(response)
            }
          }
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}
