import { Component, inject, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';

@Component({
  selector: 'app-supplier-docs',
  imports: [MatCustomDialogComponent, MatDynamicTableComponent],
  templateUrl: './supplier-docs.component.html',
  styles: ``,
})
export class SupplierDocsComponent {
  documents: unknown[] = [];
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'documento', label: 'Documento', type: 'string' },
    { key: 'secuencial', label: 'Secuencial', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  dialogIcon = signal('docs');
  dialogTitle = signal('Documentos del Proveedor');

  readonly data = inject<unknown>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SupplierDocsComponent>);

  ngOnInit() {
    console.log(this.data);
  }

  onClose() {
    this.dialogRef.close();
  }
}
