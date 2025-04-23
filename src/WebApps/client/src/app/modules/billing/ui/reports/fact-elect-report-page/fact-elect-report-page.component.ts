import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { DOC_TYPE_SRI, REPORT_FORMAT } from '@core/constants/global.constants';
import { DocumentoElectronicoWebRepository } from '@billing/data/documento-electronico/documento-electronico-web.repository';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@customer/ui/company-customer/components/company-customer-search/company-customer-search.component';
import { UserSearchComponent } from '@core/components/user-search/user-search.component';
import { isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { SharedService } from '@core/services/shared.service';
import { formatDateToString } from '@core/utils/date.util';
import { BILLING_CODE_REPORT } from '@billing/domain/enums/billing.enum.ts';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-fact-elect-report-page',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    UserSearchComponent,
    MatCardContent,
    MatCard,
    ThemeButtonComponent,
  ],
  templateUrl: './fact-elect-report-page.component.html',
  styles: ``,
})
export class FactElectReportPageComponent {
  private docElectSvc = inject(DocumentoElectronicoWebRepository);
  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);
  dataSearch = {
    checkBoxCustomer: false,
    checkBoxUser: false,
    idTipoDocumento: 0,
    idEstablecimiento: 0,
    idPuntoEmision: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codEstado: 0,
    codeRetencion: 'ALL',
    codeDevolucion: 'ALL',
    companyCustomerId: 0,
    userId: 0,
    identificacion: null as string | null,
  };

  establecimientos: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  estadosDoc: any[] = [];
  tiposDoc: any[] = [];
  empresas: any[] = [];

  showField = true;
  format: any;

  retenciones = [
    { code: 'ALL', descripcion: 'Todos' },
    { code: 'CR', descripcion: 'Con Retención' },
    { code: 'SR', descripcion: 'Sin Retención' },
  ];
  devoluciones = [
    { code: 'ALL', descripcion: 'Todos' },
    { code: 'CD', descripcion: 'Con Devolución' },
    { code: 'SD', descripcion: 'Sin Devolución' },
  ];

  private dataReporte: any = {
    [DOC_TYPE_SRI.F]: {
      tipo: 2,
      codigo: BILLING_CODE_REPORT.FEG,
    },
    [DOC_TYPE_SRI.NC]: {
      tipo: 3,
      codigo: BILLING_CODE_REPORT.NCRG,
    },
    [DOC_TYPE_SRI.LC]: {
      tipo: 4,
      codigo: BILLING_CODE_REPORT.NCRG,
    },
    [DOC_TYPE_SRI.R]: {
      tipo: 5,
      codigo: BILLING_CODE_REPORT.FCRRG,
    },
  };

  onChangeTipoDoc() {
    let dataTipoDoc = this.tiposDoc.find(
      (td) => td.idTipoDocumento === this.dataSearch.idTipoDocumento,
    );
    this.showField = false;

    if (dataTipoDoc && dataTipoDoc.codDoc === DOC_TYPE_SRI.F) {
      this.showField = true;
    }
  }

  getDataFilter() {
    this.docElectSvc.getDataFilter().subscribe((response) => {
      const { estabs, estadosDoc, tiposDoc } = response;
      this.establecimientos = estabs;
      if (this.establecimientos.length > 0) {
        const dataEstab = this.establecimientos.find(
          (estab) => estab.defaultEstab,
        );
        this.puntosEmision = dataEstab?.puntosEmision ?? [];
      }
      this.tiposDoc = tiposDoc;
      const dataTipoDoc = this.tiposDoc.find(
        (tipoDoc) => tipoDoc.codDoc === DOC_TYPE_SRI.F,
      );
      this.dataSearch.idTipoDocumento = dataTipoDoc.idTipoDocumento;
      this.estadosDoc = estadosDoc;
    });
  }

  ngOnInit() {
    this.getDataFilter();
  }

  onChangeEstab() {
    const dataEstab = this.establecimientos.find(
      (estab) => estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
    );
    if (dataEstab) {
      this.puntosEmision = dataEstab.puntosEmision;
      this.dataSearch.idPuntoEmision = 0;
    } else {
      this.puntosEmision = [];
      this.dataSearch.idPuntoEmision = 0;
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  resultEmptyInputCustomer() {
    this.dataSearch.companyCustomerId = 0;
    this.dataSearch.identificacion = null;
  }
  onCustomerSelected({ data }: any) {
    this.dataSearch.identificacion = data.numeroIdentificacion;
    this.dataSearch.companyCustomerId = data.idCliente;
  }

  emptyInputUser() {
    this.dataSearch.userId = 0;
  }

  onUserSelected({ data }: any) {
    this.dataSearch.userId = data.idUsuario;
  }

  getReportPdf() {
    this.format = REPORT_FORMAT.PDF;
    this.getReport();
  }
  getReportExcel() {
    this.format = REPORT_FORMAT.EXCEL;
    this.getReport();
  }

  private getReport() {
    try {
      if (
        this.dataSearch.checkBoxCustomer &&
        !isValidField(this.dataSearch.identificacion)
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Cliente',
        });
        return;
      }
      if (
        this.dataSearch.checkBoxUser &&
        !isValidField(this.dataSearch.userId)
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Usuario',
        });
        return;
      }
      const dataEstab = this.establecimientos.find(
        (estab) =>
          estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
      );
      // let dataEstado = this.estadosDoc.find(estado => estado.idEstadoDocumento === this.dataSearch.idEstadoDocumento);
      const { codDoc } = this.tiposDoc.find(
        (item) => item.idTipoDocumento === this.dataSearch.idTipoDocumento,
      );
      const idCliente = this.dataSearch.checkBoxCustomer
        ? this.dataSearch.companyCustomerId
        : null;
      const identificacion = this.dataSearch.checkBoxCustomer
        ? isValidField(this.dataSearch.identificacion)
        : null;
      const idUsuario = this.dataSearch.checkBoxUser
        ? isValidField(this.dataSearch.userId)
        : null;
      const ckRetencion =
        this.dataSearch.codeRetencion === 'ALL'
          ? null
          : this.dataSearch.codeRetencion === 'CR';
      const ckDevolucion =
        this.dataSearch.codeDevolucion === 'ALL'
          ? null
          : this.dataSearch.codeDevolucion === 'CD';

      const getDataReport = this.dataReporte[codDoc];
      const dataParams = {
        tipo: getDataReport.tipo,
        ckFecha: true,
        codDoc,
        codEstab: (dataEstab && dataEstab.codEstab) || null,
        idCliente,
        codEstado:
          (this.dataSearch.codEstado && this.dataSearch.codEstado) || null,
        fechaInicio: this.dataSearch.fromDate,
        fechaFin: this.dataSearch.toDate,
        identificacion,
        idUsuario,
        ckRetencion,
        ckDevolucion,
      };
      const reportParams = JSON.stringify({
        hasParams: false,
        codigo: getDataReport.codigo,
        format: this.format,
        aditionalParams: [],
      });

      const parameters = {
        hasIdUsuarioRol: true,
        reportParams,
        dataParams: JSON.stringify(dataParams),
      };
      this.sharedSvc.getReport({
        data: parameters,
        format: this.format,
        isOldVersion: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
