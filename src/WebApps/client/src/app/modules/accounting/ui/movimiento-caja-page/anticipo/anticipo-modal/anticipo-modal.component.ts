import { Component, inject, signal, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SubEntidadFinanciera } from '@accounting/data/models/subentidad-financiera.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { AnticipoUseCase } from '@accounting/movimiento-caja/application/anticipo.use-case';
import { Button } from '@acontplus/ng-components';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

@Component({
  selector: 'app-anticipo-modal',
  imports: [
    ReactiveFormsModule,
    CompanyCustomerSearchComponent,
    Button,
    MatCustomDialogComponent,
    ToUpperCaseDirective,
  ],
  templateUrl: './anticipo-modal.component.html',
  styles: ``,
})
export class AnticipoModalComponent implements OnInit {
  private activeModal = inject(MatDialogRef<AnticipoModalComponent>);
  private tS = inject(ToastrNotificationService);
  private _anticipoUseCase = inject(AnticipoUseCase);

  textBtn = 'Guardar';
  iconBtn = 'save';

  isSimpleModeCompanyCustomer = true;

  private tempSubEntidadesFinanciera = signal<SubEntidadFinanciera[]>([]);
  establecimientos = signal<EstablecimientoSelectHtmlOnly[]>([]);
  entidadesFinanciera = signal<EntidadFinanciera[]>([]);
  subEntidadesFinanciera = signal<SubEntidadFinanciera[]>([]);

  dataForm = new FormGroup({
    idCliente: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    codEstab: new FormControl('', Validators.required),
    idEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idSubEntidadFinanciera: new FormControl(0, [
      Validators.required,
      this.greaterThanZeroValidator,
    ]),
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
    this._anticipoUseCase.getDataForm().subscribe((response) => {
      const { establecimientos, entidadesFinanciera, subEntidadesFinanciera } = response;

      this.establecimientos.set(establecimientos);
      const dataEstab = this.establecimientos().find((estab) => estab.predeterminado);
      if (dataEstab) {
        this.dataForm.get('codEstab')?.setValue(dataEstab.codEstab);
      }
      this.entidadesFinanciera.set(entidadesFinanciera);
      this.tempSubEntidadesFinanciera.set(subEntidadesFinanciera);
    });
  }
  onCustomerSelected(data: CompanyCustomerEntity) {
    this.dataForm.get('idCliente')?.setValue(data.idCliente);
  }

  onChangeEntidadFinanciera() {
    const idEntidadFinanciera = this.dataForm.value.idEntidadFinanciera;
    if (idEntidadFinanciera) {
      const subEntidadesFinanciera = this.tempSubEntidadesFinanciera().filter(
        (ef) => ef.idEntidadFinanciera === idEntidadFinanciera,
      );
      this.subEntidadesFinanciera.set(subEntidadesFinanciera);
    }
  }

  save() {
    try {
      if (this.dataForm.invalid) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }
      const params = this.dataForm.value;

      if (Number(params.valor) === 0) {
        this.tS.show({
          type: 'warning',
          message: 'El valor tiene que ser mayor a 0!',
        });
        return;
      }

      this._anticipoUseCase.create(params).subscribe((response) => {
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
          this.activeModal.close(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onModalClose() {
    this.activeModal.close();
  }
}
