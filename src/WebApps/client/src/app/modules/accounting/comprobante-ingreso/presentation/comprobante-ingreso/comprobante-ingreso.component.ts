import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { finalize } from 'rxjs';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { DynamicCard } from '@acontplus/ng-components';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Pagination } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { ComprobanteIngresoUseCase } from '@accounting/comprobante-ingreso/application/comprobante-ingreso.use-case';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ComprobanteIngreso } from '@accounting/comprobante-ingreso/domain/comp-ingreso.model';
import { formatDateToString } from '@core/utils/date.util';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isValidField } from '@core/utils/utils';

@Component({
  selector: 'app-comprobante-ingreso',
  imports: [
    DynamicCard,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './comprobante-ingreso.component.html',
  styles: ``,
})
export class ComprobanteIngresoComponent implements OnInit {
  private _comprobanteIngresoUseCase = inject(ComprobanteIngresoUseCase);

  loading = signal(false);
  pagination = signal(new Pagination());

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Doc', type: 'string' },
    { key: 'fechaRegistro', label: 'Fecha Registro', type: 'string' },
    { key: 'nroIdentificacion', label: 'Nro. Identificación', type: 'string' },
    { key: 'nomCliente', label: 'Cliente', type: 'string' },
    { key: 'total', label: 'Total', type: 'string' },
    { key: 'abono', label: 'Abono', type: 'string' },
    { key: 'cambio', label: 'Cambio', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
    { key: 'nomUsuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  comprobantesIngreso: ComprobanteIngreso[] = [];
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codEstab: '',
    totalRecords: 0,
    maxSize: 5,
    byTipoPersona: '',
    identificacionComprador: null,
    byEstado: '',
  };
  moreSearchOptions = false;
  isCustomerSearchSimple = true;
  companyCustomerSearchName = '';
  recordsQuantity = [25, 50, 100];
  tiposPersona = [
    { codigo: 1, descripcion: 'Cliente' },
    { codigo: 2, descripcion: 'Empleado' },
  ];
  disabledTempInputPersona = false;
  showCliente = false;
  showEmpleado = false;
  isSearchEmployeeSimple = true;
  private sharedSvc = inject(SharedService);
  private tS = inject(ToastrNotificationService);

  refresh() {
    this.getComprobantesIngreso();
  }
  getComprobantesIngreso() {
    if (this.loading()) return;

    const checkBoxEstado = typeof this.dataSearch.byEstado === 'number';
    const checkBoxPersona = typeof this.dataSearch.byTipoPersona === 'number';
    const params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      codEstab: isValidField(this.dataSearch.codEstab),
      checkBoxEstado: checkBoxEstado,
      byEstado: isValidField(this.dataSearch.byEstado),
      checkBoxPersona,
      nroIdentificacion: isValidField(this.dataSearch.identificacionComprador),
    };
    this.comprobantesIngreso = [];

    this.loading.set(true);
    this._comprobanteIngresoUseCase
      .getAll(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.comprobantesIngreso = response.data;
      });
  }

  ngOnInit() {
    this.sharedSvc.getEstabAsign().subscribe((establecimientos) => {
      this.establecimientos = establecimientos as EstablecimientoSelectHtmlOnly[];
      if (this.establecimientos.length > 0) {
        const dataEstab = this.establecimientos.find((estab) => estab.predeterminado);
        this.dataSearch.codEstab = dataEstab?.codEstab || '';
        this.getComprobantesIngreso();
      }
    });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getComprobantesIngreso();
  }

  pageChanged(): void {
    this.getComprobantesIngreso();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getComprobantesIngreso();
  }

  onClickBtnMore() {
    this.moreSearchOptions = !this.moreSearchOptions;
  }

  onChangePersona() {
    this.showCliente = false;
    this.showEmpleado = false;
    this.dataSearch.identificacionComprador = null;
    this.companyCustomerSearchName = '';
    if (typeof this.dataSearch.byTipoPersona === 'number' && this.dataSearch.byTipoPersona === 1) {
      this.showCliente = true;
      this.showEmpleado = false;
    }
    if (typeof this.dataSearch.byTipoPersona === 'number' && this.dataSearch.byTipoPersona === 2) {
      this.showCliente = false;
      this.showEmpleado = true;
    }
  }

  onCustomerSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.identificacionComprador = data.identificacionComprador;
    this.companyCustomerSearchName = data.razonSocialComprador;
  }

  resultCustomerEmptyInput($event: any) {
    this.dataSearch.identificacionComprador = null;
    this.companyCustomerSearchName = '';
  }

  filterValidation() {
    if (typeof this.dataSearch.byTipoPersona === 'number') {
      if (!isValidField(this.dataSearch.identificacionComprador)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el cliente o el empleado',
        });
        return;
      }
    }

    this.getComprobantesIngreso();
  }

  onEmployeeSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.identificacionComprador = data.nroIdentificacion;
    this.companyCustomerSearchName = data.nombreCompleto;
  }

  employeeclearSearch($event: any) {
    this.dataSearch.identificacionComprador = null;
    this.companyCustomerSearchName = '';
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
