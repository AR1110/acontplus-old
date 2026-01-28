import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { DataGrid, DataGridColumn, Pagination } from '@acontplus/ng-components';
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
    DataGrid,
    DateRangeSelectionComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatInput,
    MatDivider,
  ],
  templateUrl: './docs-guia-remision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsGuiaRemisionComponent {
  readonly dialogRef = inject(MatDialogRef<DocsGuiaRemisionComponent>);

  loading = signal(false);
  dataSource = signal([]);
  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'nomDoc', header: 'Tipo Doc' },
    { field: 'fechaEmision', header: 'Fecha Emisión' },
    { field: 'serieComprobante', header: 'Serie Comprobante' },
    { field: 'total', header: 'Total' },
  ];

  pagination = signal(new Pagination());

  refresh() {
    // TODO: Implementar lógica de refresh
  }

  changeDateRange(_event: { from: string; to: string }) {
    // TODO: Implementar lógica de cambio de fecha
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }

  close() {
    this.dialogRef.close();
  }
}
