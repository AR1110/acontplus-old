import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataGrid, DataGridColumn } from '@acontplus/ng-components';

@Component({
  selector: 'app-pago-detalle-modal',
  imports: [MatCustomDialogComponent, DataGrid],
  templateUrl: './pago-detalle-modal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagoDetalleModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PagoDetalleModalComponent>);
  readonly data = inject<unknown[]>(MAT_DIALOG_DATA);

  columnsDefs: DataGridColumn[] = [
    { field: 'nroCuota', header: 'Nro. Cuota.' },
    { field: 'cuota', header: 'Cuota' },
    { field: 'abono', header: 'Abono' },
    { field: 'saldo', header: 'Saldo' },
  ];

  dataSource: unknown[] = [];

  ngOnInit() {
    this.dataSource = this.data;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
