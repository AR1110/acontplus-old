import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats.use-case';

@Component({
  selector: 'app-retencion-ats',
  imports: [
    BreadcrumbComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatMenuTrigger,
    MatIconButton,
    MatIcon,
    MatMenuItem,
    MatMenu,
    MatDynamicTableComponent,
    MatPaginator,
  ],
  templateUrl: './retencion-ats.component.html',
  styles: ``,
})
export class RetencionAtsComponent {
  retenciones: RetencionAtsList[] = [];
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmision', label: 'Subcategoría', type: 'string' },
    { key: 'subcategoryName', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'importeTotal', label: 'Total', type: 'number' },
    { key: 'rucEmisor', label: 'Ruc Emisor', type: 'string' },
    { key: 'razonSocialEmisor', label: 'Razón Social Emisor', type: 'string' },
    { key: 'claveAcceso', label: 'No. Aut.', type: 'string' },
    { key: 'fechaAutorizacion', label: 'F. Aut.', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);

  pagination = signal(new MatPagination());

  loadData() {
    this._retencionAtsUseCase
      .getAll(this.pagination())
      .subscribe((response) => {
        this.retenciones = response.retenciones;
        this.pagination().totalRecords = response.retenciones[0].totalRecords;
      });
  }

  onPageChanged($event: PageEvent) {
    this.pagination().pageIndex = $event.pageIndex;
    this.pagination().pageSize = $event.pageSize;
    this.loadData();
  }

  downloadXml(item: any) {}

  getRide(item: any) {}
}
