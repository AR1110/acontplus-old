import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { isValidField } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-sub-entidad-financiera-page-modal',
  templateUrl: './sub-entidad-financiera-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatCustomDialogComponent,
  ],
})
export class SubEntidadFinancieraDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SubEntidadFinancieraDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  tS = inject(ToastrNotificationService);
  private subEntidadHttp = inject(SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN);

  params = {
    idEntidadFinanciera: 0,
    nameEntidadFinanciera: '',
    idSubEntidadFinanciera: 0,
    descripcion: '',
    codigo: '',
    controlCaja: false,
    estado: false,
  };

  titleModal = 'Nuevo SubEntidad Financiera';
  btnText = 'Guardar';

  dataForm = new FormGroup({
    idEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idSubEntidadFinanciera: new FormControl(0),
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    controlCaja: new FormControl(false),
    estado: new FormControl(false),
    interes: new FormControl(0),
  });

  greaterThanZeroValidator(control: AbstractControl<number>): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { lessThanZero: true }; // Validation failed
    }
    return null; // Validation passed
  }

  ngOnInit() {
    this.params = { ...this.params, ...this.data };
    this.dataForm.get('idEntidadFinanciera')?.setValue(this.params.idEntidadFinanciera);
    if (this.params.idSubEntidadFinanciera > 0) {
      this.dataForm.get('idSubEntidadFinanciera')?.setValue(this.params.idSubEntidadFinanciera);
      this.dataForm.get('codigo')?.setValue(this.params.codigo);
      this.dataForm.get('descripcion')?.setValue(this.params.descripcion);
      this.dataForm.get('controlCaja')?.setValue(this.params.controlCaja);
      this.dataForm.get('estado')?.setValue(this.params.estado);
      this.titleModal = 'Editar SubEntidad Financiera';
      this.btnText = 'Actualizar';
    }
  }

  onChangeDescripcion() {
    const descripcion = this.dataForm.value.descripcion || '';
    if (isValidField(descripcion)) {
      this.dataForm.get('codigo')?.setValue(descripcion.slice(0, 3));
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
      const data = this.dataForm.value;

      if (!(this.params.idSubEntidadFinanciera > 0)) {
        this.subEntidadHttp.create(data).subscribe((response) => {
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
      }

      if (this.params.idSubEntidadFinanciera > 0) {
        this.subEntidadHttp
          .update(this.params.idSubEntidadFinanciera, data)
          .subscribe((response) => {
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
      }
    } catch (error) {
      console.log(error);
    }
  }
}
