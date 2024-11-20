import {Component, inject} from '@angular/core';
import {
  CustomContainerDialogComponent
} from "@core/components/custom-container-dialog/custom-container-dialog.component";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PagoDetalleLista} from "@modules/accounting/cuenta-por-pagar/interfaces/pago-detalle.interface";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";

@Component({
    selector: 'app-pago-detalle-modal',
    imports: [
        CustomContainerDialogComponent,
        MatButton,
        MatDynamicTableComponent
    ],
    templateUrl: './pago-detalle-modal.component.html',
    styles: ``
})
export class PagoDetalleModalComponent {
  readonly dialogRef = inject(MatDialogRef<PagoDetalleModalComponent>);
  readonly data = inject<PagoDetalleLista[]>(MAT_DIALOG_DATA);

  columnsDefs: ColumnDefinition[] = [
    { key: 'nroCuota', label: 'Nro. Cuota.', type: 'string' },
    { key: 'cuota', label: 'Cuota', type: 'number' },
    { key: 'abono', label: 'Abono', type: 'number',  },
    { key: 'saldo', label: 'Saldo', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<PagoDetalleLista>([]);
  ngOnInit(){
    this.dataSource =  new MatTableDataSource (this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
