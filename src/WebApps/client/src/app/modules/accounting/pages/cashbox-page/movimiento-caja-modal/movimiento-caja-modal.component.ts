import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { ControlCaja } from '@modules/accounting/models/cashbox.model';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { ModalService } from '@core/services/modal.service';
import { CashboxCloseModalComponent } from '../cashbox-close-modal/cashbox-close-modal.component';
import { getPermisosLocal, isValidField } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { UserPermissionService } from '@modules/config/services/user-permission.service';
import { isApiResponse } from '@core/models/api-response';
import { SharedService } from '@core/services/shared.service';
import { CODE_ESTADO, CODE_REPORT, FORMAT_REPORT } from '@core/constants/global.constants';
import { hideLoader, showLoader } from '@core/utils/loader';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { ToasterService } from '@core/services/toaster.service';
import { EntidadFinanciera } from '@modules/accounting/models/entidad-financiera.model';
@Component({
  selector: 'app-movimiento-caja-modal',
  standalone: true,
  imports: [AppModule, AccountingModule, DateRangeSelectionComponent],
  templateUrl: './movimiento-caja-modal.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MovimientoCajaModalComponent {
  @Input("params") params = {
    idCaja: 0,
    idUsuario: 0
  }

  private activeModal = inject(NgbActiveModal);
  private controlCajaSvc = inject(ControlCajaService);
  private modalSvc = inject(ModalService)
  private userPermissionSvc = inject(UserPermissionService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);

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
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    statusMovement: '',
    codEstado: ''
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
  }];


  dataMovientoControCaja = {} as ControlCaja;

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
    try {
      this.getMovimientosCaja();
      let getDataPermiso: any = getPermisosLocal();

      if (getDataPermiso) {
        this.dataPermisosCaja = getDataPermiso.permisoCaja;
      }
      showLoader()
      this.controlCajaSvc.getDataFilter().subscribe({
        next: (response) => {
          hideLoader();
          const estados = response.estados;
          const dataEstado = estados.find((estado: any) => estado.codEstado === CODE_ESTADO.NCBR);
          if (dataEstado) {
            this.dataSearch.codEstado = dataEstado.codEstado;
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

  onDateRangeSelection(range: { from: string, to: string }) {

    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getMovimientosCaja()
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


  recordShownTransactionPending<T extends ControlCaja>(data: T) {
    this.dataMovientoControCaja = data;

  }
  getReportTransactionPending(format: 'pdf' | 'excel') {
    try {
      if (!(this.params.idUsuario > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'idUsuario no proporcionado!'
        })
        return
      }
      let toDate;
      if (this.dataMovientoControCaja.fechaCierre && !isValidField(this.dataMovientoControCaja.fechaCierre)) {
        toDate = new Date(this.dataMovientoControCaja.fechaCierre);
      } else {
        toDate = new Date()
      }


      let fromDate = new Date(this.dataMovientoControCaja.fechaApertura)
      let dataParams = {
        tipo: 2,
        ckFecha: true,
        codDoc: null,
        codEstab: null,
        codEstado: this.dataSearch.codEstado,
        fechaInicio: formatDateMoment(fromDate),
        fechaFin: formatDateMoment(toDate),
        identificacion: null,
        idUsuario: this.params.idUsuario,
        idCliente: null,
      }
      const parameters = {
        hasIdUsuarioRol: true,
        reportParams: JSON.stringify({
          hasParams: false,
          codigo: CODE_REPORT.FG,
          format,
          aditionalParams: [],
        }),
        dataParams: JSON.stringify(dataParams),
      }

      this.sharedSvc.getReport(parameters, format, true)
    } catch (error) {
      console.log(error)
    }
  }

  //Modal Filtro Reporte Detalle Caja
  openModalReporteFiltroDetalleCaja(params: ControlCaja) {
    try {
      const modalRef = this.modalSvc.openModalCustom(ReporteFiltroDetalleCajaModal, { size: 'sm' });
      modalRef.componentInstance.params = params || {};

    } catch (error) {
      console.log(error)
    }
  }

  closeModal() {
    this.activeModal.close(this.isReloadCaja);
  }
}


@Component({
  selector: 'app-reporte-filtro-detalle-caja-modal',
  standalone: true,
  imports: [AppModule, AccountingModule, DateRangeSelectionComponent],
  template: `
		<div class="modal-header">
			<h4 class="modal-title">Reporte Detalle Caja</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
        <div class="form-group">
          <label for="entidadFinanciera">Entidad Financiera</label>
          <select name="entidadFinanciera" id="entidadFinanciera" class="form-select" [(ngModel)]="dataSearch.idEntidadFinanciera">
            @for(item of entidadesFinanciera; track $index){
              <option [ngValue]="item.idEntidadFinanciera">{{item.descripcion}}</option>
            }
          </select>
        </div>
        <div class="form-group">
          <label for="dateRangeSelection">Rango Fechas: </label>
          <app-date-range-selection
            (onChangeDateRange)="onDateRangeSelection($event)"
            [options]="dateRangeOptions"
          />
      </div>
      <div class="d-grid gap-2 col-12 mx-auto">
  <button class="btn btn-warning" type="button" (click)="getReport('pdf')">
    <fa-icon [icon]="['fas', 'file-pdf']"></fa-icon>
        PDF
  </button>
  <button class="btn btn-success" type="button" (click)="getReport('excel')">
     <fa-icon [icon]="['fas', 'file-excel']"></fa-icon>
        EXCEL
  </button>
</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">&times; Cerrar</button>
		</div>
	`,
})
export class ReporteFiltroDetalleCajaModal {
  @Input("params") params = {
    id: 0,
  }

  private controlCajaSvc = inject(ControlCajaService);
  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);


  activeModal = inject(NgbActiveModal);

  dataSearch = {
    idEntidadFinanciera: 0,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
  }

  entidadesFinanciera: Array<EntidadFinanciera> = [];

  dateRangeOptions = {
    timePicker: true,
    format: 'YYYY-MM-DD HH:mm'
  }

  ngOnInit() {
    try {
      this.controlCajaSvc.getDataForm().subscribe({
        next: (response) => {
          hideLoader();
          let { formaPagos } = response as { formaPagos: any }
          this.entidadesFinanciera = formaPagos;
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  onDateRangeSelection(range: { from: string, to: string }) {

    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  getReport(format: 'pdf' | 'excel') {
    try {
      if (!(this.params.id > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'id no proporcionado!'
        })
        return
      }

      // Extract components
      const [year, month, day, time] = this.dataSearch.fromDate.match(/\d+/g) as any;
      const [hour, minute, second] = time.split(':');

      // Create a new Date object
      const dateObject = new Date(year, month - 1, day, hour, minute, second);

      // Extract time
      const hours = dateObject.getHours();
      const minutes = dateObject.getMinutes();
      const seconds = dateObject.getSeconds();

      // Format the time
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      console.log(formattedTime);


      let dataParams = {
        tipo: 2,
        idEntidadFinanciera: this.dataSearch.idEntidadFinanciera,
        id: this.params.id,
        horaInicio: 0,
        horaFin: 0
      }
      const parameters = {
        hasIdUsuarioRol: true,
        reportParams: JSON.stringify({
          hasParams: false,
          codigo: CODE_REPORT.FG,
          format,
          aditionalParams: [],
        }),
        dataParams: JSON.stringify(dataParams),
      }

      //this.sharedSvc.getReport(parameters, format, true)
    } catch (error) {
      console.log(error)
    }
  }

}
