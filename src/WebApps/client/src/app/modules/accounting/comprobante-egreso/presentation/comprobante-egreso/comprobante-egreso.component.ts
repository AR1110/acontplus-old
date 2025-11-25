import {
  Component,
  inject,
  model,
  signal,
  TemplateRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { Pagination, DynamicCard } from '@acontplus/ng-components';
import { ListComprobanteEgresoUseCase } from '@accounting/comprobante-egreso/application/use-cases/list-comprobante-egreso.use-case';
import { DataFilterComprobanteEgresoUseCase } from '@accounting/comprobante-egreso/application/use-cases/data-filter-comprobante-egreso.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { formatDateToString } from '@core/utils/date.util';
import { ComprobanteEgresoList } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { PageEvent } from '@angular/material/paginator';
import { MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';

import { ActionComprobanteEgresoReportDirective } from '@accounting/shared/directives/action-comprobante-egreso-report.directive';
import { ActionComprobanteEgresoAnularDirective } from '@accounting/shared/directives/action-comprobante-egreso-anular.directive';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';

@Component({
  selector: 'app-comprobante-egreso',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,

    BreadcrumbComponent,
    DynamicCard,
    DateRangeSelectionComponent,
    MatDynamicTableComponent,
    MatMenu,
    MatMenuItem,
    //Directives
    ActionComprobanteEgresoReportDirective,
    ActionComprobanteEgresoAnularDirective,
    SupplierSearchComponent,
  ],
  templateUrl: './comprobante-egreso.component.html',
  styles: ``,
})
export class ComprobanteEgresoComponent implements OnInit, AfterViewInit {
  private $listUseCase = inject(ListComprobanteEgresoUseCase);
  private $dataFilterUseCase = inject(DataFilterComprobanteEgresoUseCase);

  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;
  dataSource = signal<ComprobanteEgresoList[]>([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Documento', type: 'string' },
    { key: 'fechaRegistro', label: 'Fecha Registro', type: 'string' },
    { key: 'nomPersona', label: 'Persona', type: 'string' },
    { key: 'total', label: 'Total', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
    { key: 'nomUsuario', label: 'Usuario', type: 'custom', columnType: 'html' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  users = signal<any[]>([]);

  dataSearch = model({
    codEstab: '',
    byEstado: 0,
    isDate: true,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    userId: 0,
    nroSecuencial: null,
    nameSupplier: '',
    byPersona: 0,
  });

  advancedFilter = signal(false);

  refresh() {
    this.getList();
  }

  private getList() {
    const search = this.dataSearch();

    // Validación inicial
    if (!isValidField(search.codEstab)) {
      Swal.fire({
        icon: 'warning',
        text: 'Establecimiento es obligatorio',
      });
      return;
    }

    // Determinar el estado, asegurando que sea 0 o 1 si es válido
    let byEstado: number | null = null;
    if ([1, 2].includes(search.byEstado)) {
      byEstado = search.byEstado === 1 ? 1 : 0;
    }

    if (isValidField(this.dataSearch().nroSecuencial)) {
      if (!ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch().nroSecuencial as any)) {
        Swal.fire({
          icon: 'warning',
          text: 'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      search.isDate = false;
    }

    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      codEstab: search.codEstab,
      checkBoxFecha: search.isDate,
      fechaInicio: search.fromDate,
      fechaFin: search.toDate,
      byEstado: byEstado,
      byPersona: isValidField(this.dataSearch().byPersona),
      // Se puede agregar validación similar para byPersona si es necesario
      byUsuario: getValidId(search.userId),
      nroSecuencial: ValidatorUtils.validAndFormatedRangeSequential(
        this.dataSearch().nroSecuencial as any,
      ),
    };

    this.$listUseCase.execute(params).subscribe((response) => {
      console.log(response);
      this.dataSource.set(response.data);
      this.pagination.update((i) => new Pagination(i.pageIndex, i.pageSize, response.totalRecords));
    });
  }

  ngOnInit() {
    this.$dataFilterUseCase.execute().subscribe((response) => {
      console.log(response);
      this.estabs = response.estabs;
      this.users.set(response.users);
      const dataEstab = this.estabs.find((item) => item.defaultEstab);
      if (dataEstab) {
        this.dataSearch.update((i) => ({
          ...i,
          codEstab: dataEstab.codEstab,
        }));
        this.getList();
      }
    });
  }

  ngAfterViewInit() {
    this.columnsDefs = this.columnsDefs.map((col) => {
      if (col.type === 'custom' && col.key === 'nomUsuario') {
        return { ...col, body: (ele: any) => `<strong>${ele.nomUsuario}-Emilio</strong>` };
      }
      return col;
    });
    console.log(this.columnsDefs);
  }

  onChangeDateRange($event: any) {
    this.dataSearch.update((item) => ({
      ...item,
      fromDate: $event.from,
      toDate: $event.to,
    }));
    this.refresh();
  }

  onSupplierSelected(data: any) {
    this.dataSearch.update((item) => ({
      ...item,
      byPersona: data.identificacionComprador,
      nameSupplier: data.name,
    }));
  }

  supplierclearSearch($event: any) {
    this.dataSearch.update((item) => ({
      ...item,
      byPersona: 0,
    }));
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
