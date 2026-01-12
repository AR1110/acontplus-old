import { Component, inject, signal, OnInit } from '@angular/core';
import { ControlCajaUseCase } from '@accounting/caja/application/use-cases/control-caja.use-case';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { SharedService } from '@core/services/shared.service';

@Component({
  selector: 'app-detalle-arqueo-caja-page-modal-modal',
  imports: [Button, MatCustomDialogComponent, MatDynamicTableComponent],
  templateUrl: './detalle-arqueo-control-caja.component.html',
})
export class DetalleArqueoControlCajaComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DetalleArqueoControlCajaComponent>);
  params = inject(MAT_DIALOG_DATA);

  dataSearch = {
    sortByDefault: 0,
    sortOrder: 'ASC',
  };
  private _controlCajaUseCase = inject(ControlCajaUseCase);
  private _sharedSvc = inject(SharedService);

  arqueoCajaDetalle = signal<any>([]);
  total = 0;

  columnsDefs: ColumnDefinition[] = [
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'cantidad', label: 'Cantidad', type: 'string' },
    { key: 'valor', label: 'Valor', type: 'string' },
    { key: 'total', label: 'Total', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  getList() {
    this._controlCajaUseCase.getArqueoCaja(this.params.id).subscribe((response) => {
      this.arqueoCajaDetalle.set(response.data || []);
      this.total = this.arqueoCajaDetalle().reduce(
        (acc: number, current: any) => acc + current.total,
        0,
      );
    });
  }

  ngOnInit() {
    this.getList();
  }

  exportData() {
    this._sharedSvc.exportToExcel(this.arqueoCajaDetalle(), 'ArqueoCajaDetalle');
  }
  close() {
    this.dialogRef.close();
  }
}
