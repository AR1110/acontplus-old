import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { DataGrid, DataGridColumn } from '@acontplus/ng-components';
import {
  SolicitudAutorizacionDetalleList,
  SolicitudAutorizacionList,
} from '@modules/config/data/models/solicitud-autorizacion.model';
import { SOLICITUD_AUTORIZACION_HTTP_TOKEN } from '@modules/config/data/config-token';

@Component({
  selector: 'app-solicitud-autorizacion-detalle',
  imports: [MatDialogContent, MatDialogActions, DataGrid],
  templateUrl: './solicitud-autorizacion-detalle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudAutorizacionDetalle implements OnInit {
  private solicitudAutorizacionHttp = inject(SOLICITUD_AUTORIZACION_HTTP_TOKEN);
  private params = inject<Partial<SolicitudAutorizacionList>>(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<SolicitudAutorizacionDetalle>);
  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'nombre', header: 'Nombre' },
    { field: 'valor', header: 'Valor' },
    { field: 'nuevoValor', header: 'Nuevo Valor' },
    { field: 'obs', header: 'Observación' },
  ];

  dataSource = signal<SolicitudAutorizacionDetalleList[]>([]);

  ngOnInit() {
    this.solicitudAutorizacionHttp.listDetalle(this.params).subscribe((response) => {
      this.dataSource.set(response);
    });
  }
  close() {
    this.dialogRef.close();
  }
}
