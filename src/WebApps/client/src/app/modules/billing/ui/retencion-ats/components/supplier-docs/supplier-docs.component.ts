import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats/retencion-ats.use-case';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-supplier-docs',
  imports: [
    MatCustomDialogComponent,
    MatDynamicTableComponent,
    MatButton,
    MatIcon,
  ],
  templateUrl: './supplier-docs.component.html',
  styles: ``,
})
export class SupplierDocsComponent implements OnInit {
  documents = signal<unknown[]>([]);
  documentsSelected = signal<unknown[]>([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmisionDocSustento', label: 'Fecha Emisión', type: 'string' },
    { key: 'documentName', label: 'Documento', type: 'string' },
    { key: 'numDocSustento', label: 'Secuencial', type: 'string' },
    { key: 'importeTotal', label: 'Total', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  dialogIcon = signal('list');
  dialogTitle = signal('Documentos del Proveedor');

  readonly data = inject<unknown>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SupplierDocsComponent>);
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);

  ngOnInit() {
    this._retencionAtsUseCase.getDocs(this.data).subscribe((response) => {
      this.documents.set(response.documents);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onRowSelected(selectedRows: any[]): void {
    // For single row selection
    if (selectedRows.length === 1) {
      const row = selectedRows[0];
      const current = this.documentsSelected();
      const index = current.findIndex((doc) => this.isSameRow(doc, row));

      if (index > -1) {
        // Remove if already selected
        this.documentsSelected.set(current.filter((_, i) => i !== index));
      } else {
        // Add if not selected
        this.documentsSelected.set([...current, row]);
      }
    }
    // For master toggle (all rows)
    else {
      this.documentsSelected.set(selectedRows);
    }
  }

  private isSameRow(a: any, b: any): boolean {
    // Implement your row comparison logic
    return a.idDocumento === b.idDocumento; // or whatever unique identifier you have
  }

  selectDocuments() {
    this.dialogRef.close({ documents: this.documentsSelected() });
  }
}
