import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { CODE_REPORT } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { SharedService } from '@core/services/shared.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { roundNumber } from '@core/utils/round-number.utils';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import Swal from 'sweetalert2';

type Modeda = {
  idMoneda: number
  cantidad: number
  descripcion: string
  valor: number
}

@Component({
  selector: 'app-cashbox-close-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './cashbox-close-modal.component.html',
  styleUrl: './cashbox-close-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CashboxCloseModalComponent {
  @Input('params') params = {
    id: 0
  }

  private activeModal = inject(NgbActiveModal);
  private controlCajaSvc = inject(ControlCajaService);
  private sharedSvc = inject(SharedService)


  monedas: Array<Modeda> = [];
  totalArqueo = 0

  ngOnInit() {

    showLoader();
    this.controlCajaSvc.getDataFormCashboxClose().subscribe({
      next: (response) => {
        hideLoader();

        const { monedas } = response as { monedas: Array<Modeda> }
        this.monedas = monedas
      },
      error(err) {
        console.log(err)
        hideLoader()
      },
    })
  }

  onChangeQuantity() {
    this.totalArqueo = this.monedas.map(val => val.valor * Number(val.cantidad))
      .reduce((acc, curr) => acc + curr, 0);
  }

  async save() {
    try {

      if (this.monedas.some(val => isNaN(val.cantidad))) {
        Swal.fire({
          icon: 'warning',
          title: '<small>Cierre de Caja</small>',
          html: `<small>Ingrese los valores validos</small>`
        });
        return
      }


      let {
        isConfirmed
      } = await Swal.fire({
        icon: 'warning',
        text: 'Esta seguro/a de guardar los valores ahora?',
        showDenyButton: true,
        confirmButtonText: `Si, guardar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false
      })

      if (isConfirmed) {
        const arqueoCaja = this.monedas.map(item => ({
          idMoneda: item.idMoneda,
          descripcion: item.descripcion,
          cantidad: item.cantidad
        }))
        const data = {
          totalArqueo: roundNumber(this.totalArqueo, 5),
          arqueoCaja

        }

        showLoader();
        this.controlCajaSvc.put(this.params.id, data).subscribe({
          next: (response) => {
            hideLoader();
            if (isApiResponse(response)) {
              if (response.code === "0") {
                Swal.fire({
                  icon: 'warning',
                  html: `<small>${response.message}</small>`
                })
              }

              if (response.code === "1") {
                let dataMail = JSON.parse(response.payload as string) || {};
                Swal.fire({
                  icon: 'warning',
                  html: `<small>${response.message}</small>`
                });

                if (dataMail.receptor) {
                  this.sendEmail(dataMail)
                }
                this.activeModal.close(response)
              }
            }
          },
          error(err) {
            hideLoader();
            console.log(err)
          },
        })

      }
    } catch (error) {
      console.log(error)
    }

  }


  sendEmail<T extends { receptor: string, codEstab: string }>(dataMail: T) {
    try {
      const data = {
        subject: 'Movimiento Caja',
        //  idUsuarioRol: this.decodeToken.idUsuarioRol,
        receptor: dataMail.receptor,
        params: {
          hasFile: true,
          isReport: "SI",
          reportParams: {
            hasParams: true,
            codEstab: dataMail.codEstab,
            codigo: CODE_REPORT.RCC,
            format: "pdf"
          },
          spParams: {
            //    idUsuarioRol: this.decodeToken.idUsuarioRol,
            id: this.params.id
          }
        }
      }

      showLoader();
      this.sharedSvc.appNotificacionInsert(data).subscribe({
        next(value) {
          console.log(value)
          hideLoader();

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
