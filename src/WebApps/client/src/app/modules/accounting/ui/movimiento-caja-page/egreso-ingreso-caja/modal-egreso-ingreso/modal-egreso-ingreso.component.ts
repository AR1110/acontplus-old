import { Component, inject } from '@angular/core';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { CashboxSelectHtmlOnly } from '@accounting/core/domain/cashbox.model';
import { SubEntidadFinanciera } from '@accounting/core/domain/subentidad-financiera.model';
import { MovimientoCajaService } from '@accounting/services/movimiento-caja.service';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { EmployeeService } from '@sale/services/employee.service';
import { ToasterService } from '@core/services/toaster.service';
import { isApiResponse } from '@core/models/api-response';
import { CompanyCustomerSearchComponent } from '@company-customer/components/company-customer-search/company-customer-search.component';
import { DOC_TYPE } from '@core/constants/global.constants';
import { EntidadFinanciera } from '@accounting/core/domain/entidad-financiera.interface';

@Component({
  selector: 'app-modal-egreso-ingreso',
  imports: [
    ReactiveFormsModule,
    NgbTypeaheadModule,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './modal-egreso-ingreso.component.html',
})
export class ModalEgresoIngresoComponent {
  titleModal = 'Nuevo Egreso/Ingreso Caja';
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  cajas: Array<CashboxSelectHtmlOnly> = [];
  entidadesFinanciera: Array<EntidadFinanciera> = [];
  subEntidadesFinanciera: Array<SubEntidadFinanciera> = [];
  tiposDocumento: Array<TipoDoc> = [];
  esTipoDocIngreso = false;
  esTipoDocGasto = false;
  dataForm = new FormGroup({
    codEstab: new FormControl('', Validators.required),
    idCaja: new FormControl(0, [
      Validators.required,
      this.greaterThanZeroValidator,
    ]),
    idTipoDocumento: new FormControl(0, [
      Validators.required,
      this.greaterThanZeroValidator,
    ]),
    idEntidadFinanciera: new FormControl(0, [
      Validators.required,
      this.greaterThanZeroValidator,
    ]),
    idSubEntidadFinanciera: new FormControl(0, [
      Validators.required,
      this.greaterThanZeroValidator,
    ]),
    // idEmpleado: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    customerId: new FormControl(0, [
      Validators.required,
      this.greaterThanZeroValidator,
    ]),

    valor: new FormControl(0, Validators.required),
    observaciones: new FormControl('', Validators.required),
    customerName: new FormControl(''),
  });
  private activeModal = inject(NgbActiveModal);
  private movimientoCajaSvc = inject(MovimientoCajaService);
  private employeeSvc = inject(EmployeeService);
  private tS = inject(ToasterService);
  private tempSubEntidadesFinanciera: Array<SubEntidadFinanciera> = [];

  greaterThanZeroValidator(
    control: AbstractControl<number>,
  ): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { lessThanZero: true }; // Validation failed
    }
    return null; // Validation passed
  }

  ngOnInit() {
    this.movimientoCajaSvc.getDataForm().subscribe((response) => {
      let {
        establecimientos,
        cajas,
        entidadesFinanciera,
        subEntidadesFinanciera,
        tiposDocumento,
      } = response;

      this.establecimientos = establecimientos;
      const dataEstab = this.establecimientos.find(
        (estab) => estab.predeterminado,
      );
      if (dataEstab) {
        this.dataForm.get('codEstab')?.setValue(dataEstab.codEstab);
      }
      this.cajas = cajas;
      this.entidadesFinanciera = entidadesFinanciera;
      this.tempSubEntidadesFinanciera = subEntidadesFinanciera;
      this.tiposDocumento = tiposDocumento;
    });
  }

  onChangeTipoDoc() {
    let dataForm = this.dataForm.value;
    let dataTipoDoc = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === dataForm.idTipoDocumento,
    );
    if (!dataTipoDoc) return;

    this.esTipoDocIngreso = dataTipoDoc.codigo === DOC_TYPE.IC;
    this.esTipoDocGasto = dataTipoDoc.codigo === DOC_TYPE.EC;
  }

  onChangeEntidadFinanciera() {
    let idEntidadFinanciera = this.dataForm.value.idEntidadFinanciera;
    if (idEntidadFinanciera) {
      this.subEntidadesFinanciera = this.tempSubEntidadesFinanciera.filter(
        (ef) => ef.idEntidadFinanciera === idEntidadFinanciera,
      );
    }
  }

  onSelectCustomer(params: any) {
    if ('data' in params) {
      this.dataForm.get('customerId')?.setValue(params.data.customerId);
    }
  }

  onEmptyCustomer() {
    this.dataForm.get('customerId')?.setValue(0);
    this.dataForm.get('customerName')?.setValue('');
  }

  /**  searchEmployee: OperatorFunction<string, Array<EmployeeSearchDto>> = (text$: Observable<string>) =>
     text$.pipes(
     debounceTime(200),
     switchMap((term) => {
     if (!term || term.length < 2) {
     return [];
     }

     return this.employeeSvc.search({ textSearch: term }).pipes(
     catchError((err) => {
     console.log(err);
     return [];
     })
     );
     })
     );**/

  /**selectEmployee($event: any) {
     let employee: EmployeeSearchDto = $event.item;
     setTimeout(() => {
     this.dataForm.get('employeeName')?.setValue(employee.nombreCompleto)
     this.dataForm.get('idEmpleado')?.setValue(employee.idEmpleado)
     })
     }**/

  save() {
    try {
      if (this.dataForm.invalid) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }
      const params = this.dataForm.value;

      if (Number(params.valor) === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'El valor tiene que ser mayor a 0!',
        });
        return;
      }

      this.movimientoCajaSvc.post(params).subscribe((response) => {
        if (isApiResponse(response)) {
          if (response.code === '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code === '1') {
            this.tS.toastr({
              type: 'success',
              message: response.message,
            });
            this.activeModal.close(response);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
