import { BILLING_CODE_REPORT, ReportFacade, ReportParamsBuilder } from '@acontplus/ng-common';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { DocElectHttpRepository } from '@billing/data/documento-electronico/doc-elect-http.repository';
import { FilterData } from '@billing/domain/models/documento-electronico.model';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { DOC_TYPE_SRI, REPORT_FORMAT } from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';
import { UserSearchComponent } from '@shared/components/user-search/user-search.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-fact-elect-report-page',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    UserSearchComponent,
    DynamicCard,
    Button,
    MatCheckbox,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
  ],
  templateUrl: './fact-elect-report-page.component.html',
  styles: ``,
})
export class FactElectReportPageComponent implements OnInit, OnDestroy {
  private readonly _docElectSvc = inject(DocElectHttpRepository);
  private readonly _tS = inject(ToastrNotificationService);
  private reportFacade = inject(ReportFacade);
  private destroy$ = new Subject<void>();

  dataSearch = {
    checkBoxCustomer: false,
    checkBoxUser: false,
    idTipoDocumento: 0,
    idEstablecimiento: 0,
    idPuntoEmision: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codEstado: 4,
    codeRetencion: 'ALL',
    codeDevolucion: 'ALL',
    companyCustomerId: 0,
    userId: 0,
    identificacion: null as string | null,
  };

  establecimientos: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  estadosDoc: any[] = [];
  tiposDoc = signal<any[]>([]);
  empresas: any[] = [];
  filterData: FilterData | null = null;
  showField = true;
  format: any;

  isLoadingFilters = false;
  isRefreshingFilters = false;
  isLoadingMainData = false;

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
      codigo: BILLING_CODE_REPORT.LCRG,
    },
    [DOC_TYPE_SRI.R]: {
      tipo: 5,
      codigo: BILLING_CODE_REPORT.FCRRG,
    },
    [DOC_TYPE_SRI.GR]: {
      tipo: 6,
      codigo: BILLING_CODE_REPORT.RGGR,
    },
  };

  onChangeTipoDoc() {
    const dataTipoDoc = this.tiposDoc().find(
      (td) => td.idTipoDocumento === this.dataSearch.idTipoDocumento,
    );

    this.showField = !!(dataTipoDoc && dataTipoDoc.codDoc === DOC_TYPE_SRI.F);
    if (this.showField) {
      this.dataSearch.codeDevolucion = 'SD';
    } else {
      this.dataSearch.codeDevolucion = 'ALL';
    }
  }

  loadFilters() {
    this.isLoadingFilters = true;

    this._docElectSvc
      .getFilters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.handleFilterDataReceived(data);
          this.isLoadingFilters = false;
        },
        error: (error) => {
          console.error('Error al cargar filtros:', error);
          this.isLoadingFilters = false;
          // Aquí puedes mostrar un toast o mensaje de error
        },
      });
  }

  ngOnInit() {
    this.loadFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  clearSearchCustomer() {
    this.dataSearch.companyCustomerId = 0;
    this.dataSearch.identificacion = null;
  }
  onCustomerSelected(data: CompanyCustomerEntity) {
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
    if (this.dataSearch.checkBoxCustomer && !isValidField(this.dataSearch.identificacion)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el Cliente',
      });
      return;
    }
    if (this.dataSearch.checkBoxUser && !isValidField(this.dataSearch.userId)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el Usuario',
      });
      return;
    }
    const dataEstab = this.establecimientos.find(
      (estab) => estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
    );
    // let dataEstado = this.estadosDoc.find(estado => estado.idEstadoDocumento === this.dataSearch.idEstadoDocumento);
    const { codDoc } = this.tiposDoc().find(
      (item) => item.idTipoDocumento === this.dataSearch.idTipoDocumento,
    );
    const idCliente = this.dataSearch.checkBoxCustomer ? this.dataSearch.companyCustomerId : null;
    const identificacion = this.dataSearch.checkBoxCustomer
      ? isValidField(this.dataSearch.identificacion)
      : null;
    const idUsuario = this.dataSearch.checkBoxUser ? isValidField(this.dataSearch.userId) : null;
    const ckRetencion =
      this.dataSearch.codeRetencion === 'ALL' ? null : this.dataSearch.codeRetencion === 'CR';
    const ckDevolucion =
      this.dataSearch.codeDevolucion === 'ALL' ? null : this.dataSearch.codeDevolucion === 'CD';

    const getDataReport = this.dataReporte[codDoc];
    const dataParams = {
      tipo: getDataReport.tipo,
      ckFecha: true,
      codDoc: codDoc ?? undefined,
      codEstab: dataEstab?.codEstab ?? undefined,
      idCliente,
      codEstado: (this.dataSearch.codEstado && this.dataSearch.codEstado) || null,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      identificacion,
      idUsuario,
      ckRetencion,
      ckDevolucion,
    };
    const reportOptions = ReportParamsBuilder.build({
      codeReport: getDataReport.codigo,
      data: dataParams,
      format: this.format,
    });

    this.reportFacade.open(reportOptions).subscribe();
  }

  /**
   * Maneja los datos recibidos de filtros
   */
  private handleFilterDataReceived(data: FilterData): void {
    this.filterData = data;

    // Extraer arrays para usar en los dropdowns
    this.establecimientos = data.estabs;
    this.tiposDoc.set(data.tipoDocumentos);

    if (this.establecimientos.length > 0) {
      const dataEstab = this.establecimientos.find((estab) => estab.defaultEstab);
      this.puntosEmision = dataEstab?.puntosEmision ?? [];
    }
    const dataTipoDoc = this.tiposDoc().find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE_SRI.F);
    this.dataSearch.idTipoDocumento = dataTipoDoc.idTipoDocumento;
    this.estadosDoc = data.estadoDocumentos;
    console.log('📊 Datos de filtros procesados:', {
      establecimientos: this.establecimientos.length,
      tipoDocumentos: this.tiposDoc().length,
      estadoDocumentos: this.estadosDoc.length,
      lastUpdated: data.lastUpdated,
    });
  }
}
