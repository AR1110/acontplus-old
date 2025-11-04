import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { PageEvent } from '@angular/material/paginator';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-docs-guia-remision',
  imports: [
    MatCustomDialogComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatInput,
    MatDivider,
  ],
  templateUrl: './docs-guia-remision.component.html',
  styles: ``,
})
export class DocsGuiaRemisionComponent {
  readonly dialogRef = inject(MatDialogRef<DocsGuiaRemisionComponent>);

  loading = false;
  dataSource = signal([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nomDoc', label: 'Tipo Doc', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Comprobante', type: 'string' },
    { key: 'total', label: 'Total', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  refresh() {}

  changeDateRange($event: { from: string; to: string }) {}

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
    this.dialogRef.close();
  }
}
