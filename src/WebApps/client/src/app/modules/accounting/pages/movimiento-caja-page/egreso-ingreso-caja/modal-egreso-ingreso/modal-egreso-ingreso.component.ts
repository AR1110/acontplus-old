
import { Component, inject } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { hideLoader, showLoader } from '@core/utils/loader';
import { CashboxSelectHtmlOnly } from '@modules/accounting/models/cashbox.model';
import { EntidadFinanciera } from '@modules/accounting/models/entidad-financiera.model';
import { SubEntidadFinanciera } from '@modules/accounting/models/subentidad-financiera.model';
import { MovimientoCajaService } from '@modules/accounting/services/movimiento-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, OperatorFunction, catchError, debounceTime, switchMap } from 'rxjs';
import { EmployeeSearchDto } from '@modules/sale/models/employee.model';
import { EmployeeService } from '@modules/sale/services/employee.service';
import { ToasterService } from '@core/services/toaster.service';
import { isApiResponse } from '@core/models/api-response';

@Component({
  selector: 'app-modal-egreso-ingreso',
  standalone: true,
  imports: [AppModule],
  templateUrl: './modal-egreso-ingreso.component.html',
})
export class ModalEgresoIngresoComponent {
  titleModal = 'Nuevo Egreso/Ingreso Caja';

  private activeModal = inject(NgbActiveModal);
  private movimientoCajaSvc = inject(MovimientoCajaService);
  private employeeSvc = inject(EmployeeService)
  private tS = inject(ToasterService)
  private tempSubEntidadesFinanciera: Array<SubEntidadFinanciera> = [];
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  cajas: Array<CashboxSelectHtmlOnly> = [];
  entidadesFinanciera: Array<EntidadFinanciera> = [];
  subEntidadesFinanciera: Array<SubEntidadFinanciera> = [];
  tiposDocumento: Array<TipoDoc> = [];


  dataForm = new FormGroup({
    codEstab: new FormControl('', Validators.required),
    idCaja: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idTipoDocumento: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idSubEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idEmpleado: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    valor: new FormControl(0, Validators.required),
    observaciones: new FormControl('', Validators.required),
    employeeName: new FormControl('')
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
    this.movimientoCajaSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader();
        let { establecimientos, cajas, entidadesFinanciera, subEntidadesFinanciera, tiposDocumento } = response;

        this.establecimientos = establecimientos;
        const dataEstab = this.establecimientos.find(estab => estab.predeterminado);
        if (dataEstab) {
          this.dataForm.get("codEstab")?.setValue(dataEstab.codEstab)
        }
        this.cajas = cajas;
        this.entidadesFinanciera = entidadesFinanciera;
        this.tempSubEntidadesFinanciera = subEntidadesFinanciera;
        this.tiposDocumento = tiposDocumento;
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }

  onChangeEntidadFinanciera() {
    let idEntidadFinanciera = this.dataForm.value.idEntidadFinanciera;
    if (idEntidadFinanciera) {
      this.subEntidadesFinanciera = this.tempSubEntidadesFinanciera.filter(ef => ef.idEntidadFinanciera === idEntidadFinanciera);
    }
  }

  searchEmployee: OperatorFunction<string, Array<EmployeeSearchDto>> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return [];
        }

        return this.employeeSvc.search({ textSearch: term }).pipe(
          catchError((err) => {
            console.log(err);
            return [];
          })
        );
      })
    );

  selectEmployee($event: any) {
    let employee: EmployeeSearchDto = $event.item;
    setTimeout(() => {
      this.dataForm.get('employeeName')?.setValue(employee.nombreCompleto)
      this.dataForm.get('idEmpleado')?.setValue(employee.idEmpleado)
    })
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
      const params = this.dataForm.value;


      if (Number(params.valor) === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'El valor tiene que ser mayor a 0!'
        })
        return
      }


      showLoader();
      this.movimientoCajaSvc.post(params).subscribe({
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
