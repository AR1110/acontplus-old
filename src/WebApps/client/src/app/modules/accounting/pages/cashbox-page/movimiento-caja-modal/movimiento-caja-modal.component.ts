import { Component, Input, ViewEncapsulation, inject, input } from '@angular/core';
import { ControlCaja } from '@modules/accounting/models/cashbox.model';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { ModalService } from '@core/services/modal.service';
import { CashboxCloseModalComponent } from '../cashbox-close-modal/cashbox-close-modal.component';
import { getPermisosLocal, isValidField } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { UserPermissionService } from '@modules/config/services/user-customer/user-permission.service';
import { isApiResponse } from '@core/models/api-response';
import { SharedService } from '@core/services/shared.service';
import { CODE_ESTADO, CODE_REPORT, FORMAT_REPORT, FORMAT_TYPE } from '@core/constants/global.constants';
import { hideLoader, showLoader } from '@core/utils/loader';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { ToasterService } from '@core/services/toaster.service';
import { EntidadFinanciera } from '@modules/accounting/models/entidad-financiera.model';
import { stringToDate } from '@core/utils/string-to-date';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { FiltroDetalleCajaReportModal } from './components/filtro-detalle-caja-report-modal/filtro-detalle-cajar-report-modal.component';
import { FiltroControlCajaReportModal } from './components/filtro-control-caja-report-modal/filtro-control-caja-report-modal.component';


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
    codEstado: '',
    checkBoxDate: false
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


  BUTTON_TRANSACTION_PENDING = 'BUTTON_TRANSACTION_PENDING'
  private format = FORMAT_REPORT.PDF;


  getMovimientosCaja() {

    let dataSearch = {
      idCaja: this.params.idCaja,
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      checkBoxDate: this.dataSearch.checkBoxDate,
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
       // this.dataPermisosCaja = getDataPermiso.cashAccountig;
        this.dataPermisosCaja = getDataPermiso.permisoCaja || {};

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
            this.generateReport(idControlCaja, this.format);
          }
        })
      } else {
        this.generateReport(idControlCaja, this.format)
      }
    } catch (error) {
      console.log(error)
    }

  }


  generateReport(idControlCaja: number, format: FORMAT_TYPE) {

    let dataParms = {
      tipo: 1,
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
    this.sharedSvc.getReport(parameters, format, true)

  }

  openModalFiltroReporteDetalleCaja(data: ControlCaja){
    try {
      const modalRef = this.modalSvc.openModalCustom(FiltroControlCajaReportModal, {
        size: 'sm'
      });
      modalRef.componentInstance.params = {
        id: data.id,
        enterKey: this.dataPermisosCaja.enterKey
      };

    } catch (error) {
      console.log(error)
    }
  }
  async askToReportType(data: ControlCaja, buttonType?: string) {

    const { isConfirmed, value } = await Swal.fire({
      title: "Seleccione el formato de reporte",
      input: "radio",
      inputOptions: {
        "pdf": "PDF",
        "excel": "EXCEL",
      },
      confirmButtonText: `Continuar&nbsp;<i class="fa fa-arrow-right"></i>`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return "Seleccione el formato de reporte!";
        }
        return null;
      },

    });

    if (isConfirmed) {
      this.dataMovientoControCaja = data;
      if (value === "pdf") {
        this.format = FORMAT_REPORT.PDF;
      }
      if (value === 'excel') {
        this.format = FORMAT_REPORT.EXCEL;
      }

      if (buttonType === this.BUTTON_TRANSACTION_PENDING) {
        this.getReportTransactionPending(value)
      } else {
        this.getReport(this.dataMovientoControCaja.id)
      }
    }
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

      let parts: string[] = this.dataMovientoControCaja.fechaApertura.split(' ');
      let dateParts: number[] = parts[0].split('/').map(part => parseInt(part, 10));
      let timeParts: number[] = parts[1].split(':').map(part => parseInt(part, 10));

      let convertedFromDate: Date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);

      let dataParams = {
        tipo: 2,
        ckFecha: true,
        codDoc: null,
        codEstab: null,
        codEstado: this.dataSearch.codEstado,
        fechaInicio: formatDateMoment(convertedFromDate),
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

  // --> Modal Filtro Reporte Detalle Caja
  openModalReporteFiltroDetalleCaja(params: ControlCaja) {
    try {
      const modalRef = this.modalSvc.openModalCustom(FiltroDetalleCajaReportModal);
      modalRef.componentInstance.params = params || {};

    } catch (error) {
      console.log(error)
    }
  }

  closeModal() {
    this.activeModal.close(this.isReloadCaja);
  }
}
