import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats/retencion-ats.use-case';

@Component({
  selector: 'app-supplier-docs',
  imports: [MatCustomDialogComponent, DataGrid, Button],
  templateUrl: './supplier-docs.component.html',
  styles: ``,
})
export class SupplierDocsComponent implements OnInit {
  documents = signal<unknown[]>([]);
  documentsSelected = signal<unknown[]>([]);

  columns: DataGridColumn[] = [
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Fecha Emisión', field: 'fechaEmisionDocSustento', sortable: true },
    { header: 'Documento', field: 'documentName', sortable: true },
    { header: 'Secuencial', field: 'numDocSustento', sortable: true },
    { header: 'Total', field: 'importeTotal', sortable: true },
  ];

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

  rowAllSelected(selectedRows: unknown): void {
    const typedRows = selectedRows as unknown[];
    this.documentsSelected.set([...typedRows]);
  }

  selectDocuments() {
    this.dialogRef.close({ documents: this.documentsSelected() });
  }
}
