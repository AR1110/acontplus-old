import { Component, inject, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';

@Component({
  selector: 'app-pago-detalle-modal',
  imports: [MatCustomDialogComponent, MatDynamicTableComponent],
  templateUrl: './pago-detalle-modal.component.html',
  styles: ``,
})
export class PagoDetalleModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PagoDetalleModalComponent>);
  readonly data = inject<any[]>(MAT_DIALOG_DATA);

  columnsDefs: ColumnDefinition[] = [
    { key: 'nroCuota', label: 'Nro. Cuota.', type: 'string' },
    { key: 'cuota', label: 'Cuota', type: 'number' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<any>([]);

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
