import { Component } from '@angular/core';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-documento-recibido-page',
  standalone: true,
  imports: [MatDynamicTableComponent, BreadcrumbComponent],
  templateUrl: './documento-recibido-page.component.html',
  styles: ``,
})
export class DocumentoRecibidoPageComponent {
  documentos: any[] = [];
  columnsDefs: ColumnDefinition[] = [];
  columns: string[] = ['serie'];

  ngOnInit() {
    this.documentos = [
      {
        serie: '001-001-000000009',
      },
    ];
    this.columnsDefs = [{ key: 'serie', label: 'Serie', type: 'string' }];
  }
}
