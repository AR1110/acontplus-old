import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { DOC_TYPE } from '@core/constants/global.constants';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { CashboxSelectHtmlOnly } from '@accounting/data/models/caja';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { SubEntidadFinanciera } from '@accounting/data/models/subentidad-financiera.model';
import { MovimientoCajaUseCase } from '@accounting/data/movimiento-caja.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { getValidId, isValidField } from '@core/utils/utils';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';

@Component({
  selector: 'app-egreso-ingreso-dialog',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCustomDialogComponent,
    CompanyCustomerSearchComponent,
    ToUpperCaseDirective,
  ],
  templateUrl: './egreso-ingreso-dialog.component.html',
  styles: ``,
})
export class EgresoIngresoDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EgresoIngresoDialogComponent>);
  readonly data = inject<{
    id: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);

  titleModal = 'Nuevo Egreso/Ingreso Caja';
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  cajas: CashboxSelectHtmlOnly[] = [];
  entidadesFinanciera: EntidadFinanciera[] = [];
  subEntidadesFinanciera: SubEntidadFinanciera[] = [];
  tiposDocumento: TipoDoc[] = [];
  esTipoDocIngreso = false;
  esTipoDocGasto = false;

  loading = signal(false);

  dataForm = new FormGroup({
    codEstab: new FormControl<string | null>(null),
    idCaja: new FormControl(0),
    idTipoDocumento: new FormControl(0),
    idEntidadFinanciera: new FormControl(0),
    idSubEntidadFinanciera: new FormControl(0),
    // idEmpleado: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    customerId: new FormControl(0),

    valor: new FormControl(0),
    observaciones: new FormControl(''),
    customerName: new FormControl(''),
  });
  private _movimientoCajaUseCase = inject(MovimientoCajaUseCase);
  private tS = inject(ToastrNotificationService);
  private tempSubEntidadesFinanciera: SubEntidadFinanciera[] = [];

  // greaterThanZeroValidator(
  //   control: AbstractControl<number>
  // ): ValidationErrors | null {
  //   const value = control.value;
  //   if (value !== null && (isNaN(value) || value <= 0)) {
  //     return { lessThanZero: true }; // Validation failed
  //   }
  //   return null; // Validation passed
  // }

  ngOnInit() {
    this._movimientoCajaUseCase.getDataForm().subscribe((response) => {
      const {
        establecimientos,
        cajas,
        entidadesFinanciera,
        subEntidadesFinanciera,
        tiposDocumento,
      } = response;

      this.establecimientos = establecimientos;
      const dataEstab = this.establecimientos.find((estab) => estab.predeterminado);
      if (dataEstab) {
        this.dataForm.get('codEstab')?.setValue(dataEstab.codEstab);
      }
      this.cajas = cajas;
      this.entidadesFinanciera = entidadesFinanciera;
      this.tempSubEntidadesFinanciera = subEntidadesFinanciera;
      this.tiposDocumento = tiposDocumento;

      if (this.cajas.length > 0) {
        const dataCaja = this.cajas[0];
        this.dataForm.get('idCaja')?.setValue(dataCaja.idCaja);
      }

      if (this.entidadesFinanciera.length > 0) {
        const dataEntidad = this.entidadesFinanciera.find((e) => e.codigo === 'EFE');
        if (dataEntidad) {
          this.dataForm.get('idEntidadFinanciera')?.setValue(dataEntidad.idEntidadFinanciera);
          this.onChangeEntidadFinanciera();
        }
      }
    });
  }

  onChangeTipoDoc() {
    const dataForm = this.dataForm.value;
    const dataTipoDoc = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === dataForm.idTipoDocumento,
    );
    if (!dataTipoDoc) return;

    this.esTipoDocIngreso = dataTipoDoc.codigo === DOC_TYPE.IC;
    this.esTipoDocGasto = dataTipoDoc.codigo === DOC_TYPE.EC;
  }

  onChangeEntidadFinanciera() {
    const idEntidadFinanciera = this.dataForm.value.idEntidadFinanciera;
    if (idEntidadFinanciera) {
      this.subEntidadesFinanciera = this.tempSubEntidadesFinanciera.filter(
        (ef) => ef.idEntidadFinanciera === idEntidadFinanciera,
      );

      if (this.subEntidadesFinanciera.length > 0) {
        const dataSubEntidad = this.subEntidadesFinanciera[0];
        this.dataForm
          .get('idSubEntidadFinanciera')
          ?.setValue(dataSubEntidad.idSubEntidadFinanciera);
      }
    }
  }

  onSelectCustomer(params: CompanyCustomerEntity) {
    this.dataForm.get('customerId')?.setValue(params.customerId);
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
      const params = this.dataForm.value;

      if (!isValidField(params.codEstab)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el establecimiento',
        });
        return;
      }

      if (!getValidId(params.idCaja as any)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la caja-page',
        });
        return;
      }

      if (!getValidId(params.idTipoDocumento as any)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el tipo documento',
        });
        return;
      }

      if (!getValidId(params.idEntidadFinanciera as any)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la entidad financiera',
        });
        return;
      }

      if (!getValidId(params.idSubEntidadFinanciera as any)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la subentidad financiera',
        });
        return;
      }

      if (!isValidField(params.valor as any)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el valor',
        });
        return;
      }

      if (!isValidField(params.observaciones)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la observacion',
        });
        return;
      }

      if (this.dataForm.invalid) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }

      if (Number(params.valor) === 0) {
        this.tS.show({
          type: 'warning',
          message: 'El valor tiene que ser mayor a 0!',
        });
        return;
      }

      this._movimientoCajaUseCase.create(params).subscribe((response) => {
        if (response.code === '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          this.dialogRef.close(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
