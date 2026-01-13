import { Component, inject, signal, ViewEncapsulation, OnInit } from '@angular/core';
import { CODE_ESTADO, REPORT_CODE, REPORT_FORMAT } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';
import { SharedService } from '@core/services/shared.service';
import { isValidField } from '@core/utils/utils';
import { ControlCaja } from '@accounting/data/models/caja';
import { UserPermissionService } from '@modules/config/services/user-customer/user-permission.service';

import {
  PermissionCashAccounting,
  UserRoleStateService,
} from '@shared/store/user-role-state.service';
import Swal from 'sweetalert2';

import { CierreCajaModalComponent } from '@accounting/ui/caja-page/components/cierre-caja-modal/cierre-caja-modal.component';
import { FiltroDetalleCajaReportModal } from '@accounting/ui/caja-page/components/filtro-detalle-caja-report-modal/filtro-detalle-cajar-report-modal.component';
import { FormsModule } from '@angular/forms';
import { SendMailDialogDirective } from '@shared/directives/send-mail-dialog.directive';
import { DetalleArqueoControlCaja } from '@accounting/ui/caja-page/components/detalle-arqueo-control-caja/detalle-arqueo-control-caja';
import { formatDateToString } from '@core/utils/date.util';
import { CONTROL_CAJA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Button, DataGrid, DataGridColumn, DateRangePicker } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@core/services/dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-caja-page-modal',
  imports: [
    FormsModule,
    SendMailDialogDirective,
    MatMenuModule,
    Button,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogContent,
    DataGrid,
    DateRangePicker,
  ],
  templateUrl: './control-caja-modal.html',
  encapsulation: ViewEncapsulation.None,
})
export class ControlCajaModal implements OnInit {
  private dialogRef = inject(MatDialogRef<ControlCajaModal>);
  readonly params = inject<{
    idCaja: number;
    idUsuario: number;
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
  page = 0;
  pageSize = 25;
  pageCount = 0;

  columns: DataGridColumn[] = [
    {
      header: 'Nro.',
      field: 'index',
      width: '60px',
      sortable: false,
    },
    {
      header: 'Op.',
      field: 'actions',
      sortable: false,
    },
    {
      header: 'Fecha Apertura',
      field: 'fechaApertura',
      sortable: true,
    },
    {
      header: 'Fecha Cierre',
      field: 'fechaCierre',
      sortable: true,
    },
    {
      header: 'Faltante',
      field: 'faltante',
      sortable: true,
    },
    {
      header: 'Sobrante',
      field: 'sobrante',
      sortable: true,
    },
    {
      header: 'Total',
      field: 'totalArqueo',
      sortable: true,
    },
    {
      header: 'Estado',
      field: 'statusName',
      sortable: true,
    },
  ];

  movimientosCaja = signal<ControlCaja[]>([]);
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
  private _controlCajaUseCase = inject(CONTROL_CAJA_HTTP_TOKEN);
  private dialogSvc = inject(DialogService);
  private userPermissionSvc = inject(UserPermissionService);
  private sharedSvc = inject(SharedService);
  private notificationSvc = inject(NotificationService);
  private pS = inject(UserRoleStateService);
  private _tokenUseCase = inject(TokenUseCase);
  private format = REPORT_FORMAT.PDF;

  getMovimientosCaja() {
    const dataSearch = {
      idCaja: this.params.idCaja,
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
      checkBoxDate: this.dataSearch.checkBoxDate,
      dateStart: this.dataSearch.fromDate,
      dateEnd: this.dataSearch.toDate,
      statusMovement: [''].includes(this.dataSearch.statusMovement)
        ? null
        : this.dataSearch.statusMovement,
    };
    this._controlCajaUseCase.getAll(dataSearch).subscribe((response) => {
      this.movimientosCaja.set(response.data);
      this.pageCount = response.totalRecords;
    });
  }

  ngOnInit() {
    try {
      this.getMovimientosCaja();

      this.pS.select('permission').subscribe((response) => {
        this.dataPermisosCaja = response.cashAccounting;
      });

      this._controlCajaUseCase.getDataFilter().subscribe((response) => {
        const estados = response.estados;
        const dataEstado = estados.find((estado: any) => estado.codEstado === CODE_ESTADO.NCBR);
        if (dataEstado) {
          this.dataSearch.codEstado = dataEstado.codEstado;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onDateRangeSelection({ startDate, endDate }: { startDate: Date; endDate: Date }) {
    this.dataSearch.fromDate = formatDateToString(startDate);
    this.dataSearch.toDate = formatDateToString(endDate);
    this.getMovimientosCaja();
  }

  onCheckboxChange(checked: boolean) {
    this.dataSearch.checkBoxDate = checked;
    this.refresh();
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
              const obj = {
                typeCheck: 1,
                clave,
              };

              const response = await this.userPermissionSvc.checkHasPermission(obj).toPromise();
              if (!response) return;

              if (response.code === '0') {
                Swal.showValidationMessage(`${response.message}`);
              }
              if (response.code === '1') {
                isOpenModal = true;
                return response.code;
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
        const modalRef = this.dialogSvc.open(CierreCajaModalComponent, {
          data: params || {},
        });
        modalRef.subscribe((result) => {
          if (result && typeof result === 'object') {
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
            const obj = {
              typeCheck: 1,
              clave,
            };

            const response = await this.userPermissionSvc.checkHasPermission(obj).toPromise();

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
    const dataParms = {
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
  //
  // openModalFiltroReporteDetalleCaja(infrastructure: ControlCaja) {
  //   try {
  //     const modalRef = this.modalSvc.openModalCustom(
  //       FiltroControlCajaReportModal,
  //       {
  //         size: 'sm',
  //       },
  //     );
  //     modalRef.componentInstance.params = {
  //       id: infrastructure.id,
  //       enterKey: this.dataPermisosCaja.enterKey,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
        this.notificationSvc.warning({
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

      const parts: string[] = this.dataMovientoControCaja.fechaApertura.split(' ');
      const dateParts: number[] = parts[0].split('/').map((part) => parseInt(part, 10));
      const timeParts: number[] = parts[1].split(':').map((part) => parseInt(part, 10));

      const convertedFromDate: Date = new Date(
        dateParts[2],
        dateParts[1] - 1,
        dateParts[0],
        timeParts[0],
        timeParts[1],
      );

      const dataParams = {
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
    this.dialogSvc.open(FiltroDetalleCajaReportModal, {
      data: params || {},
    });
  }

  // --> Modal Detalle ArqueoCaja
  openModalDetalleArqureoCaja(params: ControlCaja) {
    try {
      this.dialogSvc.open(DetalleArqueoControlCaja, {
        data: params || {},
      });
    } catch (error) {
      console.log(error);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.refresh();
  }

  close() {
    this.dialogRef.close(this.isReloadCaja);
  }
}
