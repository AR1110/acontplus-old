import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnticipoService } from '@accounting/services/anticipo.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SubEntidadFinanciera } from '@accounting/core/domain/subentidad-financiera.model';
import { ToasterService } from '@core/services/toaster.service';
import { isApiResponse } from '@core/models/api-response';
import {
  CompanyCustomerSearchComponent
} from "@company-customer/components/company-customer-search/company-customer-search.component";
import {EntidadFinanciera} from "@accounting/core/domain/entidad-financiera.interface";

@Component({
    selector: 'app-anticipo-modal',
    imports: [
        ReactiveFormsModule,
        CompanyCustomerSearchComponent
    ],
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
    this.anticipoSvc.getDataForm().subscribe( (response) => {
        let { establecimientos, entidadesFinanciera, subEntidadesFinanciera } = response;

        this.establecimientos = establecimientos;
        const dataEstab = this.establecimientos.find(estab => estab.predeterminado);
        if (dataEstab) {
          this.dataForm.get("codEstab")?.setValue(dataEstab.codEstab)
        }
        this.entidadesFinanciera = entidadesFinanciera;
        this.tempSubEntidadesFinanciera = subEntidadesFinanciera;
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


      this.anticipoSvc.post(params).subscribe( (response) => {

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
      })
    } catch (error) {
      console.log(error)
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}
