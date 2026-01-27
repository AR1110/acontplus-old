import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import {
  DataGrid,
  DataGridColumn,
  Pagination,
  Button,
  DateRangePicker,
  DateRangeValue
} from '@acontplus/ng-components';
import { COMPROBANTE_EGRESO_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { formatDateToString } from '@core/utils/date.util';
import { ComprobanteEgresoList } from '@accounting/data/models/comprobante-egreso.entity';
import { PageEvent } from '@angular/material/paginator';
import { MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';

import { ActionComprobanteEgresoReportDirective } from '@accounting/shared/directives/action-comprobante-egreso-report.directive';
import { ActionComprobanteEgresoAnularDirective } from '@accounting/shared/directives/action-comprobante-egreso-anular.directive';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';

@Component({
  selector: 'app-comprobante-egreso-page',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,

    BreadcrumbComponent,
    DataGrid,
    Button,
    DateRangePicker,
    MatMenu,
    MatMenuItem,
    //Directives
    ActionComprobanteEgresoReportDirective,
    ActionComprobanteEgresoAnularDirective,
    SupplierSearchComponent,
  ],
  templateUrl: './comprobante-egreso-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComprobanteEgresoPage implements OnInit {
  private comprobanteEgresoHttp = inject(COMPROBANTE_EGRESO_HTTP_TOKEN);

  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<unknown>;
  dataSource = signal<ComprobanteEgresoList[]>([]);
  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'nroDoc', header: 'Nro. Documento' },
    { field: 'fechaRegistro', header: 'Fecha Registro' },
    { field: 'nomPersona', header: 'Persona' },
    { field: 'total', header: 'Total' },
    { field: 'nomEstado', header: 'Estado' },
    { field: 'nomUsuario', header: 'Usuario' },
  ];

  pagination = signal(new Pagination());

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  users = signal<{ idUsuario: number; nombreUsuario: string }[]>([]);

  dataSearch = signal({
    codEstab: '',
    byEstado: 0,
    isDate: true,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    userId: 0,
    nroSecuencial: null as string | null,
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
      void Swal.fire({
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
      if (!ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch().nroSecuencial ?? '')) {
        void Swal.fire({
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
        this.dataSearch().nroSecuencial ?? '',
      ),
    };

    this.comprobanteEgresoHttp.list(params).subscribe((response) => {
      this.dataSource.set(response.data);
      this.pagination.update((i) => new Pagination(i.pageIndex, i.pageSize, response.totalRecords));
    });
  }

  ngOnInit() {
    this.comprobanteEgresoHttp.getFilterData().subscribe((response) => {
      this.estabs = response.estabs;
      this.users.set(response.users as { idUsuario: number; nombreUsuario: string }[]);
      const dataEstab = this.estabs.find((item) => item.defaultEstab);
      if (dataEstab) {
        this.dataSearch.set({
          ...this.dataSearch(),
          codEstab: dataEstab.codEstab,
        });
        this.getList();
      }
    });
  }

  onChangeDateRange(event: DateRangeValue<true>) {
    this.dataSearch.set({
      ...this.dataSearch(),
      fromDate: event.from,
      toDate: event.to,
    });
    this.refresh();
  }

  onSupplierSelected(data: { identificacionComprador: string; name: string }) {
    this.dataSearch.set({
      ...this.dataSearch(),
      byPersona: parseInt(data.identificacionComprador, 10) || 0,
      nameSupplier: data.name,
    });
  }

  supplierclearSearch(_event: unknown) {
    this.dataSearch.set({
      ...this.dataSearch(),
      byPersona: 0,
    });
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
