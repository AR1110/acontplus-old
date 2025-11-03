import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import {
  SolicitudAutorizacionDetalle,
  SolicitudAutorizacionList,
} from '@modules/config/domain/models/solicitud-autorizacion.model';
import { ListSolicitudAutorizacionDetalleUseCase } from '@modules/config/application/use-cases/solicitud-autorizacion/list-solicitud-autorizacion-detalle.use-case';

@Component({
  selector: 'app-solicitud-autorizacion-detalle',
  imports: [MatCustomDialogComponent, MatDynamicTableComponent],
  templateUrl: './solicitud-autorizacion-detalle.component.html',
  styles: ``,
})
export class SolicitudAutorizacionDetalleComponent implements OnInit {
  private $listDetalleUseCase = inject(ListSolicitudAutorizacionDetalleUseCase);
  private params = inject<Partial<SolicitudAutorizacionList>>(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<SolicitudAutorizacionDetalleComponent>);
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'nombre', label: 'Nombre', type: 'string' },
    { key: 'valor', label: 'Valor', type: 'string' },
    { key: 'nuevoValor', label: 'Nuevo Valor', type: 'string' },
    { key: 'obs', label: 'Observación', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = signal<SolicitudAutorizacionDetalle[]>([]);

  ngOnInit() {
    this.$listDetalleUseCase.execute(this.params).subscribe((response) => {
      this.dataSource.set(response);
    });
  }
  close() {
    this.dialogRef.close();
  }
}
