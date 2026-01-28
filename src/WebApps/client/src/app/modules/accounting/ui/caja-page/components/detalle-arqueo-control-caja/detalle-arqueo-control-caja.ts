import { Component, inject, signal, OnInit } from '@angular/core';
import { CONTROL_CAJA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { Button, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '@core/services/shared.service';

@Component({
  selector: 'app-detalle-arqueo-caja-page-modal-modal',
  imports: [Button, DataGrid, MatDialogContent, MatDialogActions],
  templateUrl: './detalle-arqueo-control-caja.html',
})
export class DetalleArqueoControlCaja implements OnInit {
  private dialogRef = inject(MatDialogRef<DetalleArqueoControlCaja>);
  params = inject(MAT_DIALOG_DATA);

  dataSearch = {
    sortByDefault: 0,
    sortOrder: 'ASC',
  };
  private _controlCajaUseCase = inject(CONTROL_CAJA_HTTP_TOKEN);
  private _sharedSvc = inject(SharedService);

  arqueoCajaDetalle = signal<any>([]);
  total = 0;

  columns: DataGridColumn[] = [
    {
      header: 'Descripción',
      field: 'descripcion',
      sortable: true,
    },
    {
      header: 'Cantidad',
      field: 'cantidad',
      sortable: true,
    },
    {
      header: 'Valor',
      field: 'valor',
      sortable: true,
    },
    {
      header: 'Total',
      field: 'total',
      sortable: true,
    },
  ];

  getList() {
    this._controlCajaUseCase.getArqueoCaja(this.params.data.id).subscribe((response) => {
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
