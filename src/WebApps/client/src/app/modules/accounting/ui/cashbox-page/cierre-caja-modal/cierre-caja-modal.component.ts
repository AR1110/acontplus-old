import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { REPORT_CODE } from '@core/constants/global.constants';
import { roundNumber } from '@core/utils/round-number.utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ControlCajaUseCase } from '@accounting/core/use-cases/control-caja.use-case';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

type Modeda = {
  idMoneda: number;
  cantidad: number;
  descripcion: string;
  valor: number;
};

@Component({
  selector: 'app-cierre-caja-modal',
    imports: [CommonModule, FormsModule, MatIcon, MatButton, ThemeButtonComponent],
  templateUrl: './cierre-caja-modal.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CierreCajaModalComponent {
  @Input('params') params = {
    id: 0,
  };

  private activeModal = inject(NgbActiveModal);
  private _controlCajaUseCase = inject(ControlCajaUseCase);
  private appNotifiSvc = inject(NotificacionService);

  monedas: Array<Modeda> = [];
  totalArqueo = 0;

  ngOnInit() {
    this._controlCajaUseCase.getDataFormCashboxClose().subscribe((response) => {
      const { monedas } = response as { monedas: Array<Modeda> };
      this.monedas = monedas;
    });
  }

  onChangeQuantity() {
    this.totalArqueo = this.monedas
      .map((val) => val.valor * Number(val.cantidad))
      .reduce((acc, curr) => acc + curr, 0);
  }

  async save() {
    try {
      if (this.monedas.some((val) => isNaN(val.cantidad))) {
        Swal.fire({
          icon: 'warning',
          title: '<small>Cierre de Caja</small>',
          html: `<small>Ingrese los valores válidos</small>`,
        });
        return;
      }

      let { isConfirmed } = await Swal.fire({
        icon: 'warning',
        text: 'Esta seguro/a de guardar los valores ahora?',
        showDenyButton: true,
        confirmButtonText: `Si, guardar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        const arqueoCaja = this.monedas.map((item) => ({
          idMoneda: item.idMoneda,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
        }));
        const data = {
          totalArqueo: roundNumber(this.totalArqueo, 5),
          arqueoCaja,
        };

        this._controlCajaUseCase
          .put(this.params.id, data)
          .subscribe((response) => {
            if (response.code === '0') {
              Swal.fire({
                icon: 'warning',
                html: `<small>${response.message}</small>`,
              });
            }

            if (response.code === '1') {
              let dataMail = JSON.parse(response.payload as string) || {};
              Swal.fire({
                icon: 'warning',
                html: `<small>${response.message}</small>`,
              });

              if (dataMail.receptor) {
                this.sendEmail(dataMail);
              }
              this.activeModal.close(response);
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
            id: this.params.id,
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

  onModalClose() {
    this.activeModal.close();
  }
}
