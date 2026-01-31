import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats/retencion-ats.use-case';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-supplier-docs',
  imports: [MatCustomDialogComponent, DataGrid, Button, DatePipe],
  templateUrl: './supplier-docs.component.html',
  styles: ``,
})
export class SupplierDocsComponent implements OnInit {
  documents = signal<unknown[]>([]);
  documentsSelected = signal<{fechaEmisionDocSustento: string} []>([]);


  columns: DataGridColumn[] = [
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Fecha Emisión', field: 'fechaEmisionDocSustento', sortable: true },
    { header: 'Documento', field: 'documentName', sortable: true },
    { header: 'Secuencial', field: 'numDocSustento', sortable: true },
    { header: 'Total', field: 'importeTotal', sortable: true },
  ];

  dialogIcon = signal('list');
  dialogTitle = signal('Documentos del Proveedor');

  readonly data = inject<{fechaEmision: Date, idCard: string, idProveedor: number}>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SupplierDocsComponent>);
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);

  fechaEmision = computed(() => {

    return this.documentsSelected().length > 0
      ? new Date(this.documentsSelected()[0].fechaEmisionDocSustento) : null

  });


  messageTextError = computed(() => {
    if(this.documentsSelected().length>0 && this.fechaEmision()){

      const docs = this.documentsSelected();
      const invalidDocs = docs.filter(doc => {
        const docDate = new Date((doc as any).fechaEmisionDocSustento);
        return !this.hasDocSamePeriodoFiscal(docDate, this.fechaEmision()!);
      });

      if (invalidDocs.length > 0) {
        return `Todos los documentos deben pertenecer al mismo período fiscal`;
      }

    }
    return null;
  });

  private hasDocSamePeriodoFiscal = (docDate: Date, targetDate: Date): boolean => {
    const docMonth = docDate.getMonth();
    const docYear = docDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();
    return docMonth === targetMonth && docYear === targetYear;
  };

  ngOnInit() {
    this._retencionAtsUseCase.getDocs(this.data).subscribe((response) => {
      this.documents.set(response.documents);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  rowAllSelected(selectedRows: unknown): void {
    const typedRows = selectedRows as any[];
    this.documentsSelected.set([...typedRows]);
  }

  selectDocuments() {

    if(this.messageTextError()){
      return;
    }

    this.dialogRef.close({ documents: this.documentsSelected() });
  }
}
