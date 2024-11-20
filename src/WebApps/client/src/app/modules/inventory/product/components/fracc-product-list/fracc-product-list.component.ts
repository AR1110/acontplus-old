import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';

@Component({
    selector: 'app-fracc-product-list',
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatDynamicTableComponent,
        CustomTableContainerComponent,
    ],
    templateUrl: './fracc-product-list.component.html',
    styles: ``
})
export class FraccProductListComponent {



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

  pagination = signal(new MatPagination())
  isLoadingResults = signal(false)
  dataSource = signal<any[]>([])



  onSearch(e:any){

  }

  refresh(){

  }




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

}
