import { CuentaPorCobrarUseCase } from '@accounting/cuenta-por-cobrar/application/cuenta-por-cobrar.use-case';
import { ReportFacade, ReportParamsBuilder, SALE_CODE_REPORT } from '@acontplus/ng-common';
import { DynamicCard } from '@acontplus/ng-components';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import {
  CODE_ESTADO,
  DOC_TYPE,
  DOC_TYPE_SRI,
  REPORT_FORMAT,
  SEPARADORES_REGEX,
} from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { isValidEmail, isValidField } from '@core/utils/utils';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { UserSearchComponent } from '@shared/components/user-search/user-search.component';
import { ActionEnviarCorreoDirective } from '@shared/directives/permission/action-enviar-correo.directive';
import { ActionReportDirective } from '@shared/directives/permission/action-report.directive';
import { NotificacionService } from '@shared/services/notificacion.service';
import Swal from 'sweetalert2';

const imports = [
  DynamicCard,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDividerModule,
  FormsModule,
  MatButtonModule,
  MatIconModule,
  BreadcrumbComponent,
  CompanyCustomerSearchComponent,
  DateRangeSelectionComponent,
  UserSearchComponent,

  //Directives
  ActionEnviarCorreoDirective,
  ActionReportDirective,
];
@Component({
  selector: 'app-sale-report-page',
  imports,
  templateUrl: './sale-report-page.component.html',
})
export class SaleReportPageComponent implements OnInit {
  isSelectedNotaEntrega = false;
  dataSearch = {
    checkBoxCustomer: false,
    checkBoxUser: false,
    ckFecha: false,
    checkboxCompanyCustomer: false,
    idEstablecimiento: 0,
    idPuntoEmision: 0,
    codEstado: 0 as string | null | number,
    codDoc: null as string | null,
    convertToDoc: false,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    companyCustomerId: 0,
    idEstadoDocumento: 0,
    userId: 0,
    identificacion: null,
    idCiudad: 0,
  };
  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  estadosDoc = signal<any[]>([]);

  tiposDoc = signal<any[]>([]);
  empresas = signal<any[]>([]);
  provinciasAgrupadas = signal<any[]>([]);

  estabCorreo = null as string | null | undefined;
  format: any;
  private _cuentaPorCobrarUseCase = inject(CuentaPorCobrarUseCase);

  private tS = inject(ToastrNotificationService);
  private appNotifiSvc = inject(NotificacionService);
  private _tokenUseCase = inject(TokenUseCase);
  private reportFacade = inject(ReportFacade);

  getDataFilter() {
    this._cuentaPorCobrarUseCase.getDataFilter().subscribe((response) => {
      const { estabs, estadosDoc, tiposDoc, empresas, ciudades } = response;

      this.establecimientos.set(estabs);
      this.estadosDoc.set(estadosDoc);
      this.tiposDoc.set([
        ...tiposDoc,
        {
          idTipoDocumento: 0,
          descripcion: 'Consolidado Diario de Venta',
          codigoSri: '',
          codigo: DOC_TYPE.CDV,
        },
      ]);
      this.empresas.set(empresas);

      const provinciasAgrupadas = ciudades.reduce((agrupador: any, ciudad: any) => {
        const provinciaIndex = agrupador.findIndex((p: any) => p.nombre === ciudad.provincia);
        if (provinciaIndex >= 0) {
          agrupador[provinciaIndex].ciudades.push(ciudad);
        } else {
          agrupador.push({
            nombre: ciudad.provincia,
            ciudades: [ciudad],
          });
        }
        return agrupador;
      }, []);
      this.provinciasAgrupadas.set(provinciasAgrupadas);

      const dataEstab = this.establecimientos().find((estab) => estab.defaultEstab);
      this.puntosEmision.set(dataEstab?.puntosEmision ?? []);
      const dataPuntoEmision = this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi);

      this.estabCorreo = dataEstab?.correo || null;

      this.dataSearch.idEstablecimiento = dataEstab?.idEstablecimiento ?? 0;
      this.dataSearch.idPuntoEmision = dataPuntoEmision?.idPuntoEmision ?? 0;

      if (this.estadosDoc().length > 0) {
        this.dataSearch.codEstado = estadosDoc.find(
          (estado: any) => estado.codigo === CODE_ESTADO.NCBR,
        )?.codigo;
      }

      const dataTipoDoc = this.tiposDoc().find((tipoDoc) => tipoDoc.codigo === DOC_TYPE.CDV);
      this.dataSearch.codDoc = dataTipoDoc.codigo;
    });
  }

  ngOnInit() {
    this.getDataFilter();
  }

  onChangeTipoDoc() {
    this.isSelectedNotaEntrega = this.dataSearch.codDoc !== DOC_TYPE.FV;
  }

  onChangeEstab() {
    const dataEstab = this.establecimientos().find(
      (estab) => estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
    );
    if (dataEstab) {
      this.estabCorreo = dataEstab.correo;
      this.puntosEmision.set(dataEstab.puntosEmision);
      this.dataSearch.idPuntoEmision = 0;
    } else {
      this.puntosEmision.set([]);
      this.dataSearch.idPuntoEmision = 0;
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  clearSearchCustomer() {
    this.dataSearch.companyCustomerId = 0;
    this.dataSearch.identificacion = null;
  }

  onCustomerSelected(data: any) {
    this.dataSearch.identificacion = data.numeroIdentificacion;
    this.dataSearch.companyCustomerId = data.idCliente;
  }

  emptyInputUser() {
    this.dataSearch.userId = 0;
  }

  onUserSelected(data: any) {
    this.dataSearch.userId = data.idUsuario;
  }

  getTipoDoc() {
    if (this.dataSearch.codDoc === DOC_TYPE.FV) return DOC_TYPE_SRI.F;
    if (this.dataSearch.codDoc === DOC_TYPE.CDV) return undefined;
    return this.dataSearch.codDoc;
  }

  private getDataParams() {
    const dataEstab = this.establecimientos().find(
      (estab) => estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
    );
    const dataEstado = this.estadosDoc().find(
      (estado) => estado.idEstadoPago === this.dataSearch.idEstadoDocumento,
    );

    const identificacion = this.dataSearch.checkBoxCustomer
      ? isValidField(this.dataSearch.identificacion)
      : null;
    const idUsuario = this.dataSearch.checkBoxUser ? isValidField(this.dataSearch.userId) : null;
    const idCliente = this.dataSearch.checkBoxCustomer
      ? isValidField(this.dataSearch.companyCustomerId)
      : null;

    return {
      tipo: 2,
      ckFecha: true,
      codDoc: this.getTipoDoc() ?? undefined,
      codEstab: dataEstab?.codEstab ?? undefined,
      codEstado: dataEstado?.codigo || null,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      identificacion,
      idUsuario,
      idCliente,
      convertToDoc: this.dataSearch.convertToDoc,
      idCiudad: this.dataSearch.idCiudad,

      userRoleId: this._tokenUseCase.getUserRoleId(),
    };
  }

  private isValidDataSearch() {
    if (this.dataSearch.checkBoxCustomer && !isValidField(this.dataSearch.identificacion)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Cliente',
      });
      return;
    }
    if (this.dataSearch.checkBoxUser && !isValidField(this.dataSearch.userId)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Usuario',
      });
      return;
    }
    return true;
  }

  getReport() {
    try {
      if (!this.isValidDataSearch()) return;

      const reportOptions = ReportParamsBuilder.build({
        codeReport: SALE_CODE_REPORT.FG,
        data: this.getDataParams(),
        format: this.format,
      });
      this.reportFacade.open(reportOptions).subscribe();

      // const reportParams = JSON.stringify({
      //   hasParams: false,
      //   codigo: SALE_CODE_REPORT.FG,
      //   format: this.format,
      // });

      // const parameters = {
      //   reportParams,
      //   dataParams: JSON.stringify(this.getDataParams()),
      //   hasService: true,
      // };
      // this.sharedSvc.getReport({
      //   data: parameters,
      //   format: this.format,
      // });
    } catch (error) {
      console.log(error);
    }
  }

  getReportPdf() {
    this.format = REPORT_FORMAT.PDF;
    this.getReport();
  }

  getReportExcel() {
    this.format = REPORT_FORMAT.EXCEL;
    this.getReport();
  }

  async askToSendMail() {
    const correos = this.estabCorreo?.split(SEPARADORES_REGEX) || [];
    if (!isValidField(this.estabCorreo)) {
      Swal.fire({
        icon: 'warning',
        text: 'El establecimiento no tiene agregado el correo',
      });
      return;
    }

    // Validar formato de cada correo
    const correosInvalidos = correos.filter((correo) => !isValidEmail(correo.trim()));

    if (correosInvalidos.length > 0) {
      Swal.fire({
        icon: 'warning',
        text: `Formato incorrecto en los siguientes correos:\n${correosInvalidos.join(', ')}`,
      });
      return;
    }

    if (!this.isValidDataSearch()) return;

    const result = await Swal.fire({
      title: 'Confirmación',
      icon: 'warning',
      html: `
        <p>¿Deseas <strong>enviar el reporte</strong> al correo electrónico asignado al establecimiento?</p>
        <p>Esta acción enviará la información automáticamente.</p>
      `,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      reverseButtons: true, // Pone Cancelar a la izquierda, más común en UX
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    const params = {
      subject: 'Reporte Ventas',
      params: {
        hasFile: true,
        isReport: 'SI',
        reportParams: {
          hasParams: false,
          codigo: SALE_CODE_REPORT.FG,
          format: REPORT_FORMAT.PDF,
        },
        spParams: this.getDataParams(),
        withTableNames: true,
      },
      codigo: SALE_CODE_REPORT.FG,
      receptor: this.estabCorreo,
    };

    this.appNotifiSvc.post(params).subscribe((response) => {
      if (response.code === '0') {
        Swal.fire({
          icon: 'warning',
          text: response.message,
        });
      }
      if (response.code === '1') {
        Swal.fire({
          icon: 'success',
          text: response.message,
        });
      }
    });
  }
}
