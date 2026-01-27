import { Component, ViewEncapsulation, inject, signal, OnInit } from '@angular/core';
import { REPORT_CODE } from '@core/constants/global.constants';
import { roundNumber } from '@core/utils/round-number.utils';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { NotificacionService } from '@shared/services/notificacion.service';
import { CONTROL_CAJA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { Button } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Modeda {
  idMoneda: number;
  cantidad: number;
  descripcion: string;
  valor: number;
}

@Component({
  selector: 'app-cierre-caja-page-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    Button,
    CurrencyPipe,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './cierre-caja-modal.html',
  encapsulation: ViewEncapsulation.None,
})
export class CierreCajaModal implements OnInit {
  private dialogRef = inject(MatDialogRef<CierreCajaModal>);
  private params = inject<{
    data: { id: number }
  }>(MAT_DIALOG_DATA);

  private _controlCajaUseCase = inject(CONTROL_CAJA_HTTP_TOKEN);
  private appNotifiSvc = inject(NotificacionService);

  monedas = signal<Modeda[]>([]);
  totalArqueo = 0;

  ngOnInit() {
    this._controlCajaUseCase.getDataFormCashboxClose().subscribe((response) => {
      this.monedas.set(response.data);
    });
  }

  onChangeQuantity() {
    this.totalArqueo = this.monedas()
      .map((val) => val.valor * Number(val.cantidad))
      .reduce((acc, curr) => acc + curr, 0);
  }

  async save() {
    try {
      if (this.monedas().some((val) => isNaN(val.cantidad))) {
        Swal.fire({
          icon: 'warning',
          title: '<small>Cierre de Caja</small>',
          html: `<small>Ingrese los valores válidos</small>`,
        });
        return;
      }

      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        text: 'Esta seguro/a de guardar los valores ahora?',
        showDenyButton: true,
        confirmButtonText: `Si, guardar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        const arqueoCaja = this.monedas().map((item) => ({
          idMoneda: item.idMoneda,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
        }));
        const data = {
          totalArqueo: roundNumber(this.totalArqueo, 5),
          arqueoCaja,
        };

        this._controlCajaUseCase.put(this.params.data.id, data).subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              html: `<small>${response.message}</small>`,
            });
          }

          if (response.code === '1') {
            const dataMail = JSON.parse(response.payload as string) || {};
            Swal.fire({
              icon: 'warning',
              html: `<small>${response.message}</small>`,
            });

            if (dataMail.receptor) {
              this.sendEmail(dataMail);
            }
            this.dialogRef.close(response);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  sendEmail<T extends { receptor: string; codEstab: string }>(dataMail: T) {
    try {
      const data = {
        subject: 'Reporte Control Caja',
        receptor: dataMail.receptor,
        params: {
          hasFile: true,
          isReport: 'SI',
          reportParams: {
            hasParams: true,
            codEstab: dataMail.codEstab,
            codigo: REPORT_CODE.RCC,
            format: 'pdf',
          },
          spParams: {
            tipo: 1,
            id: this.params.data.id,
          },
        },
      };

      this.appNotifiSvc.post(data).subscribe((value) => {
        console.log(value);
      });
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
