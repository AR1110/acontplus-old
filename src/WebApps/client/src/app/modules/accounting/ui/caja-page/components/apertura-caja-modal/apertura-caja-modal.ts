import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';

import { CONTROL_CAJA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { Button } from '@acontplus/ng-components';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { PaymentTypeCode } from '@accounting/shared/enums/accounting.constants';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apertura-caja-page-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Button,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './apertura-caja-modal.html',
})
export class AperturaCajaModal implements OnInit {
  private dialogRef = inject(MatDialogRef<AperturaCajaModal>);
  readonly params = inject<{ idCaja: number }>(MAT_DIALOG_DATA);
  private _controlCajaUseCase = inject(CONTROL_CAJA_HTTP_TOKEN);
  private tS = inject(ToastrNotificationService);

  entidadesFinanciera: EntidadFinanciera[] = [];

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idEntidadFinanciera: new FormControl(0, Validators.required),
    concepto: new FormControl(''),
    entrada: new FormControl(0, Validators.required),
  });

  ngOnInit() {
    this.dataForm.get('idCaja')?.setValue(this.params.idCaja);

    this._controlCajaUseCase.getDataForm().subscribe((response) => {
      const { formaPagos } = response as { formaPagos: any };
      this.entidadesFinanciera = formaPagos;
      const dataEF = this.entidadesFinanciera.find((item) => item.codigo === PaymentTypeCode.EFE);
      if (dataEF) {
        this.dataForm.get('idEntidadFinanciera')?.setValue(dataEF.idEntidadFinanciera);
      }
    });
  }

  save() {
    try {
      const data = this.dataForm.value;
      if (this.dataForm.invalid) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }
      if (!(typeof data.idEntidadFinanciera == 'number' && data.idEntidadFinanciera > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }

      if (data.idCaja && data.idCaja > 0) {
        this._controlCajaUseCase.post(data).subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              html: response.message,
            });
          }
          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              html: response.message,
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
