import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { ControlCaja } from '@modules/accounting/models/cashbox.model';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { ModalService } from '@core/services/modal.service';
import { CashboxCloseModalComponent } from '../cashbox-close-modal/cashbox-close-modal.component';
import { getPermisosLocal } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { UserPermissionService } from '@modules/config/services/user-permission.service';
import { isApiResponse } from '@core/models/api-response';
import { SharedService } from '@core/services/shared.service';
import { CODE_REPORT } from '@core/constants/global.constants';
import { hideLoader, showLoader } from '@core/utils/loader';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
@Component({
  selector: 'app-movimiento-caja-modal',
  standalone: true,
  imports: [AppModule, AccountingModule, DateRangeSelectionComponent],
  templateUrl: './movimiento-caja-modal.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MovimientoCajaModalComponent {
  @Input("params") params = {
    idCaja: 0
  }
  private activeModal = inject(NgbActiveModal);
  private controlCajaSvc = inject(ControlCajaService);
  private modalSvc = inject(ModalService)
  private userPermissionSvc = inject(UserPermissionService);
  private sharedSvc = inject(SharedService)

  dataPermisosCaja = {
    cerrarCaja: false,
    verOtrasCajas: false,
    reporteMovimientoCaja: false,
    enterKey: false
  }
  isReloadCaja = false;


  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    fromDate: '',
    toDate: '',
    statusMovement: ''
  }

  page = 1;

  totalRecords = 0;
  recordsQuantity = [25, 50, 100, 200, 500];

  movimientosCaja: Array<ControlCaja> = [];

  estadosMovimiento = [{
    estado: false,
    descripcion: 'CERRADO'
  }, {
    estado: true,
    descripcion: 'ABIERTO'
  }]

  getMovimientosCaja() {

    let dataSearch = {
      idCaja: this.params.idCaja,
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      checkBoxDate: true,
      dateStart: this.dataSearch.fromDate,
      dateEnd: this.dataSearch.toDate,
      statusMovement: [""].includes(this.dataSearch.statusMovement) ? null : this.dataSearch.statusMovement
    }
    showLoader();
    this.controlCajaSvc.getAll(dataSearch).subscribe({
      next: (response) => {
        hideLoader();

        const { movimientos } = response as { movimientos: Array<ControlCaja> }

        this.movimientosCaja = movimientos;
        this.totalRecords = this.movimientosCaja.length > 0 ? this.movimientosCaja[0].totalRecords : 0
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }

  ngOnInit() {

    this.getMovimientosCaja();
    let getDataPermiso: any = getPermisosLocal();

    if (getDataPermiso) {
      this.dataPermisosCaja = getDataPermiso.permisoCaja;
    }
  }

  onDateRangeSelection(range: { from: string, to: string }) {
    
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  pageChanged(): void {
    this.getMovimientosCaja();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getMovimientosCaja();
  }

  refresh() {
    this.getMovimientosCaja()
  }

  cerrarCaja(estado: boolean) {
    return (estado && this.dataPermisosCaja.cerrarCaja);
  }

  verReporteMovimientoCaja(estado: boolean) {

    if (this.dataPermisosCaja.verOtrasCajas) {
      return true;
    }

    return (!estado && this.dataPermisosCaja.reporteMovimientoCaja);
  }


  async openModalCashboxClose(params: ControlCaja) {
    try {

      let isOpenModal = false;
      if (this.dataPermisosCaja.enterKey) {
        await Swal.fire({
          title: 'Ingrese su clave',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showDenyButton: true,
          confirmButtonText: 'Continuar',
          denyButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          allowEscapeKey: false,
          backdrop: true,
          preConfirm: async (clave) => {
            try {
              let obj = {
                typeCheck: 1,
                clave
              };

              const response = await this.userPermissionSvc.checkHasPermission(obj).toPromise();

              if (isApiResponse(response)) {
                if (response.code === "0") {
                  Swal.showValidationMessage(
                    `${response.message}`
                  )
                }
                if (response.code === "1") {
                  isOpenModal = true;
                  return response.code;
                }
              }

              return true;
            } catch (err) {
              console.log(err);
              // Swal.showValidationMessage(
              //   `${err}`
              // )
              return false
            }
          },
          allowOutsideClick: () => Swal.isLoading(),
        })
      } else {
        isOpenModal = true;
      }

      if (isOpenModal) {

        const modalRef = this.modalSvc.openModalCustom(CashboxCloseModalComponent, { size: 'lg', centered: true });
        modalRef.componentInstance.params = params || {};
        modalRef.result.then(result => {
          if (typeof result === 'object') {
            this.isReloadCaja = true;
            this.getMovimientosCaja();
          }
        })
      }


    } catch (error) {
      console.log(error)
    }
  }



  getReport(idControlCaja: number) {
    try {
      if (this.dataPermisosCaja.enterKey) {
        Swal.fire({
          title: 'Ingrese su clave',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showDenyButton: true,
          confirmButtonText: 'Continuar',
          denyButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          allowEscapeKey: false,
          backdrop: true,
          preConfirm: async (clave) => {
            let obj = {
              typeCheck: 1,
              clave
            };

            const response = await this.userPermissionSvc.checkHasPermission(obj).toPromise();

            if (isApiResponse(response)) {
              if (response.code === "0") {
                Swal.showValidationMessage(
                  `${response.message}`
                )
              }
              if (response.code === "1") {
                return response.code;
              }
            }

            return true;
          },
          allowOutsideClick: () => Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            this.generateReport(idControlCaja);
          }
        })
      } else {
        this.generateReport(idControlCaja)
      }
    } catch (error) {
      console.log(error)
    }

  }




  generateReport(idControlCaja: number) {
    let format = 'pdf'
    let dataParms = {
      id: idControlCaja,
    }
    const parameters = {
      hasService: true, //reporte sin idRol, si es true el idRol(idUsuariol) enviamos en un json
      reportParams: JSON.stringify({
        codigo: CODE_REPORT.RCC,
        format,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataParms)
    }
    this.sharedSvc.getReport(parameters, "pdf", true)

  }

  closeModal() {
    this.activeModal.close(this.isReloadCaja);
  }
}
