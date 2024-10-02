import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { NotaEntregaService } from '@modules/sale/services/nota-entrega.service';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-nota-entrega-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,

    //components
    BreadcrumbComponent,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent
  ],
  templateUrl: './nota-entrega-page.component.html',
  styles: ``
})
export class NotaEntregaPageComponent {

  private notaEntregaSvc = inject(NotaEntregaService)

  isSearchAdvanced = signal(false)
  isLoadingResults = signal(false)


  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'fechaVencimiento', label: 'Fecha Vcto', type: 'string' },
    { key: 'razonSocialComprador', label: 'Cliente', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<any>();

  pagination = signal(new MatPagination());


  private getDataParams() {
    let params = {

      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,

    };
    return params;
  }


  private successResponseNotaEntregaAll(response: any) {

    this.dataSource = new MatTableDataSource(response.data);

    this.pagination.update((p) => ({
      ...p,
      totalRecords: response.totalRecords,
    }));

  }

  private getNotasEntrega() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true)
    this.notaEntregaSvc
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe((response) => {
        this.successResponseNotaEntregaAll(response);
      });
  }

  refresh() {
    this.getNotasEntrega()
  }

  ngOnInit(): void {
    this.getNotasEntrega()

  }


  onDateRangeSelection(e:any){

  }


  handlePageEvent(e: PageEvent) {

  }



}
