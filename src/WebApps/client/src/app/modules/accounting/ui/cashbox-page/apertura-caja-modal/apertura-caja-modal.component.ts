import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ToasterService } from '@core/services/toaster.service';
import { MatIcon } from '@angular/material/icon';
import { EntidadFinanciera } from '@accounting/core/models/entidad-financiera.interface';
import { ControlCajaUseCase } from '@accounting/core/use-cases/control-caja.use-case';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {PaymentTypeCode} from "@accounting/core/enums/accounting.constants";

@Component({
  selector: 'app-apertura-caja-modal',
    imports: [FormsModule, ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatIcon, MatButton, ThemeButtonComponent,
    MatCustomDialogComponent
    ],
  templateUrl: './apertura-caja-modal.component.html',
})
export class AperturaCajaModalComponent {
  private dialogRef = inject(MatDialogRef<AperturaCajaModalComponent>)
  readonly params = inject<{ idCaja: number }>(MAT_DIALOG_DATA);
  private _controlCajaUseCase = inject(ControlCajaUseCase);
  private tS = inject(ToasterService);

  entidadesFinanciera: Array<EntidadFinanciera> = [];

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idEntidadFinanciera: new FormControl(0, Validators.required),
    concepto: new FormControl(''),
    entrada: new FormControl(0, Validators.required),
  });

  ngOnInit() {
    this.dataForm.get('idCaja')?.setValue(this.params.idCaja);

    this._controlCajaUseCase.getDataForm().subscribe((response) => {
      let { formaPagos } = response as { formaPagos: any };
      this.entidadesFinanciera = formaPagos;
      let dataEF = this.entidadesFinanciera.find(item=>item.codigo===PaymentTypeCode.EFE)
      if(dataEF){
        this.dataForm.get('idEntidadFinanciera')?.setValue(dataEF.idEntidadFinanciera);
      }
    });
  }

  save() {
    try {
      let data = this.dataForm.value;
      if (this.dataForm.invalid) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }
      if (
        !(
          typeof data.idEntidadFinanciera == 'number' &&
          data.idEntidadFinanciera > 0
        )
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }

      if (data.idCaja && data.idCaja > 0) {
        this._controlCajaUseCase.post(data).subscribe((response) => {
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
            this.dialogRef.close(response);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
