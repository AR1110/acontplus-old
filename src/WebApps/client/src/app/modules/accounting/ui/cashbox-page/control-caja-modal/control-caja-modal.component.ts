import {Component, inject, signal, ViewEncapsulation} from '@angular/core';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import {
  CODE_ESTADO,
  REPORT_CODE,
  REPORT_FORMAT,
} from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { ControlCaja } from '@accounting/core/models/cashbox.model';
import { UserPermissionService } from '@modules/config/services/user-customer/user-permission.service';

import {
  PermissionCashAccounting,
  UserRoleStateService,
} from '@shared/store/user-role-state.service';
import Swal from 'sweetalert2';

import { CierreCajaModalComponent } from '@accounting/ui/cashbox-page/cierre-caja-modal/cierre-caja-modal.component';
import { FiltroControlCajaReportModal } from '@accounting/ui/cashbox-page/control-caja-modal/components/filtro-control-caja-report-modal/filtro-control-caja-report-modal.component';
import { FiltroDetalleCajaReportModal } from '@accounting/ui/cashbox-page/control-caja-modal/components/filtro-detalle-caja-report-modal/filtro-detalle-cajar-report-modal.component';
import { FormsModule } from '@angular/forms';
import { SendMailDialogDirective } from '@shared/directives/send-mail-dialog.directive';
import { DetalleArqueoControlCajaModalComponent } from '@accounting/ui/cashbox-page/control-caja-modal/components/detalle-arqueo-control-caja-modal/detalle-arqueo-control-caja-modal.component';
import { formatDateToString } from '@core/utils/date.util';
import { ControlCajaUseCase } from '@accounting/core/use-cases/control-caja.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatPagination} from "@shared/models/pagination.model";
import {PageEvent} from "@angular/material/paginator";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-control-caja-modal',
  imports: [
    FormsModule,

    DateRangeSelectionComponent,
    SendMailDialogDirective,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    MatButton,
    MatMenuItem,
    ThemeButtonComponent,
    MatCheckbox,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatDynamicTableComponent,
    MatIconButton,
    MatMenuModule
  ],
  templateUrl: './control-caja-modal.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ControlCajaModalComponent {

  private dialogRef = inject(MatDialogRef<ControlCajaModalComponent>)
  readonly params = inject<{
    idCaja:number
    idUsuario: number
  }>(MAT_DIALOG_DATA);
  dataPermisosCaja: PermissionCashAccounting = {
    cerrarCaja: false,
    verOtrasCajas: false,
    reporteMovimiento: false,
    enterKey: false,
    reporteTransaccionPendiente: false,
    reporteDetalleControlCaja: false,
  };
  isReloadCaja = false;
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    statusMovement: '',
    codEstado: '',
    checkBoxDate: false,
  };
  page = 1;
  totalRecords = 0;
  movimientosCaja  = signal<ControlCaja[]>([]);
  estadosMovimiento = [
    {
      estado: false,
      descripcion: 'CERRADO',
    },
    {
      estado: true,
      descripcion: 'ABIERTO',
    },
  ];
  dataMovientoControCaja = {} as ControlCaja;
  BUTTON_TRANSACTION_PENDING = 'BUTTON_TRANSACTION_PENDING';
  private _controlCajaUseCase = inject(ControlCajaUseCase);
  private modalSvc = inject(ModalService);
  private userPermissionSvc = inject(UserPermissionService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);
  private pS = inject(UserRoleStateService);
  private _tokenUseCase = inject(TokenUseCase);
  private format = REPORT_FORMAT.PDF;


  columnsDefs: ColumnDefinition[] = [

    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: '#', type: 'string' },
    { key: 'fechaApertura', label: 'Fecha Apertura', type: 'string' },
    { key: 'fechaCierre', label: 'Fecha Cierre', type: 'string' },
    { key: 'faltante', label: 'Faltante', type: 'string' },
    { key: 'sobrante', label: 'Sobrante', type: 'string' },
    { key: 'totalArqueo', label: 'Total', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());

  getMovimientosCaja() {
    let dataSearch = {
      idCaja: this.params.idCaja,
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      checkBoxDate: this.dataSearch.checkBoxDate,
      dateStart: this.dataSearch.fromDate,
      dateEnd: this.dataSearch.toDate,
      statusMovement: [''].includes(this.dataSearch.statusMovement)
        ? null
        : this.dataSearch.statusMovement,
    };
    this._controlCajaUseCase.getAll(dataSearch).subscribe( (response) => {
        const { movimientos=[] } = response as { movimientos: Array<ControlCaja> };
        const movimientosCaja = movimientos.map((item:any, index: number)=>{
          return {
            ...item,
            index: index+1,
            nomEstado: item.estado ? 'ABIERTO': 'CERRADO',
          }
        })
        this.movimientosCaja.set(movimientosCaja);
        this.pagination.update(item=>{
          return {
            ...item,
            totalRecords: this.movimientosCaja.length > 0
              ? this.movimientosCaja()[0].totalRecords
              : 0
          }
        })
    });
  }

  ngOnInit() {
    try {
      this.getMovimientosCaja();

      this.pS.select('permission').subscribe((response) => {
        this.dataPermisosCaja = response.cashAccounting;
      });

      this._controlCajaUseCase.getDataFilter().subscribe(  (response) => {
          const estados = response.estados;
          const dataEstado = estados.find(
            (estado: any) => estado.codEstado === CODE_ESTADO.NCBR,
          );
          if (dataEstado) {
            this.dataSearch.codEstado = dataEstado.codEstado;
          }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getMovimientosCaja();
  }

  refresh() {
    this.getMovimientosCaja();
  }

  cerrarCaja(estado: boolean) {
    return estado && this.dataPermisosCaja.cerrarCaja;
  }

  verReporteMovimientoCaja(estado: boolean) {
    if (!estado) {
      return true;
    }
    return this.dataPermisosCaja.reporteMovimiento;
  }

  getDataSendMail(item: any) {
    return {
      subject: 'Reporte Control Caja',
      receptor: item.receptor,
      params: {
        hasFile: true,
        isReport: 'SI',
        reportParams: {
          hasParams: true,
          codEstab: item.codEstab,
          codigo: REPORT_CODE.RCC,
          format: 'pdf',
        },
        spParams: {
          tipo: 1,
          id: item.id,
        },
      },
    };
  }

  async openModalCashboxClose(params: ControlCaja) {
    try {
      let isOpenModal = false;
      if (this.dataPermisosCaja.enterKey) {
        await Swal.fire({
          title: 'Ingrese su clave',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off',
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
                clave,
              };

              const response = await this.userPermissionSvc
                .checkHasPermission(obj)
                .toPromise();

              if (isApiResponse(response)) {
                if (response.code === '0') {
                  Swal.showValidationMessage(`${response.message}`);
                }
                if (response.code === '1') {
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
              return false;
            }
          },
          allowOutsideClick: () => Swal.isLoading(),
        });
      } else {
        isOpenModal = true;
      }

      if (isOpenModal) {
        const modalRef = this.modalSvc.openModalCustom(
          CierreCajaModalComponent,
          { size: 'lg', centered: true },
        );
        modalRef.componentInstance.params = params || {};
        modalRef.result.then((result) => {
          if (typeof result === 'object') {
            this.isReloadCaja = true;
            this.getMovimientosCaja();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  getReport(idControlCaja: number) {
    try {
      if (this.dataPermisosCaja.enterKey) {
        Swal.fire({
          title: 'Ingrese su clave',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off',
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
              clave,
            };

            const response = await this.userPermissionSvc
              .checkHasPermission(obj)
              .toPromise();

            if (isApiResponse(response)) {
              if (response.code === '0') {
                Swal.showValidationMessage(`${response.message}`);
              }
              if (response.code === '1') {
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
        });
      } else {
        this.generateReport(idControlCaja, this.format);
      }
    } catch (error) {
      console.log(error);
    }
  }

  generateReport(idControlCaja: number, format: REPORT_FORMAT) {
    let dataParms = {
      tipo: 1,
      id: idControlCaja,
    };
    const parameters = {
      hasService: true, //reporte sin idRol, si es true el idRol(idUsuariol) enviamos en un json
      reportParams: JSON.stringify({
        codigo: REPORT_CODE.RCC,
        format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParms),
    };
    this.sharedSvc.getReport({
      data: parameters,
      format: format,
      isOldVersion: true,
    });
  }

  openModalFiltroReporteDetalleCaja(data: ControlCaja) {
    try {
      const modalRef = this.modalSvc.openModalCustom(
        FiltroControlCajaReportModal,
        {
          size: 'sm',
        },
      );
      modalRef.componentInstance.params = {
        id: data.id,
        enterKey: this.dataPermisosCaja.enterKey,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async askToReportType(data: ControlCaja, buttonType?: string) {
    const { isConfirmed, value } = await Swal.fire({
      title: 'Seleccione el formato de reporte',
      input: 'radio',
      inputOptions: {
        pdf: 'PDF',
        excel: 'EXCEL',
      },
      confirmButtonText: `Continuar&nbsp;<i class="fa fa-arrow-right"></i>`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Seleccione el formato de reporte!';
        }
        return null;
      },
    });

    if (isConfirmed) {
      this.dataMovientoControCaja = data;
      if (value === 'pdf') {
        this.format = REPORT_FORMAT.PDF;
      }
      if (value === 'excel') {
        this.format = REPORT_FORMAT.EXCEL;
      }

      if (buttonType === this.BUTTON_TRANSACTION_PENDING) {
        this.getReportTransactionPending(value);
      } else {
        this.getReport(this.dataMovientoControCaja.id);
      }
    }
  }

  getReportTransactionPending(format: 'pdf' | 'excel') {
    try {
      if (!(this.params.idUsuario > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'idUsuario no proporcionado!',
        });
        return;
      }
      let toDate;
      if (
        this.dataMovientoControCaja.fechaCierre &&
        !isValidField(this.dataMovientoControCaja.fechaCierre)
      ) {
        toDate = new Date(this.dataMovientoControCaja.fechaCierre);
      } else {
        toDate = new Date();
      }

      let parts: string[] =
        this.dataMovientoControCaja.fechaApertura.split(' ');
      let dateParts: number[] = parts[0]
        .split('/')
        .map((part) => parseInt(part, 10));
      let timeParts: number[] = parts[1]
        .split(':')
        .map((part) => parseInt(part, 10));

      let convertedFromDate: Date = new Date(
        dateParts[2],
        dateParts[1] - 1,
        dateParts[0],
        timeParts[0],
        timeParts[1],
      );

      let dataParams = {
        tipo: 2,
        ckFecha: true,
        codDoc: null,
        codEstab: null,
        codEstado: this.dataSearch.codEstado,
        fechaInicio: formatDateToString(convertedFromDate),
        fechaFin: formatDateToString(toDate),
        identificacion: null,
        idUsuario: this.params.idUsuario,
        idCliente: null,

        userRoleId: this._tokenUseCase.getUserRoleId(),
      };

      const parameters = {
        hasService: true,
        reportParams: JSON.stringify({
          hasParams: false,
          codigo: REPORT_CODE.FG,
          format,
          aditionalParams: [],
        }),
        dataParams: JSON.stringify(dataParams),
      };

      this.sharedSvc.getReport({
        data: parameters,
        format: format,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // --> Modal Filtro Reporte Detalle Caja
  openModalReporteFiltroDetalleCaja(params: ControlCaja) {
    try {
      const modalRef = this.modalSvc.openModalCustom(
        FiltroDetalleCajaReportModal,
      );
      modalRef.componentInstance.params = params || {};
    } catch (error) {
      console.log(error);
    }
  }

  // --> Modal Detalle ArqueoCaja
  openModalDetalleArqureoCaja(params: ControlCaja) {
    try {
      const modalRef = this.modalSvc.openModalCustom(
        DetalleArqueoControlCajaModalComponent,
      );
      modalRef.componentInstance.params = params || {};
    } catch (error) {
      console.log(error);
    }
  }


  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }

  close() {
    this.dialogRef.close(this.isReloadCaja);
  }
}
