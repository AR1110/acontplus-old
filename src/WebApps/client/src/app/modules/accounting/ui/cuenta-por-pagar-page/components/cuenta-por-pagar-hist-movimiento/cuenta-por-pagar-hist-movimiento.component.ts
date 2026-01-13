import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

import { DataGrid, DataGridColumn, DynamicCard, Button } from '@acontplus/ng-components';
import { finalize } from 'rxjs';
import { CuentaPorPagarLista } from '@accounting/data/models/cuenta-por-pagar.model';
import { HistorialPagoLista } from '@accounting/data/models/historial-pago.model';
import { MatDivider } from '@angular/material/divider';
import { DialogService } from '@core/services/dialog.service';
import { PagoDetalleModalComponent } from '@accounting/ui/cuenta-por-pagar-page/components/pago-detalle-modal/pago-detalle-modal.component';
import { ComprobanteEgresoLista } from '@accounting/data/models/comprobante-egreso.entity';
import { MatTooltip } from '@angular/material/tooltip';
import { CUENTA_POR_PAGAR_HTTP_TOKEN } from '@accounting/data/accounting-token';

@Component({
  selector: 'app-cuenta-por-pagar-page-hist-movimiento',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule,
    DynamicCard,
    MatDivider,
    MatCustomDialogComponent,
    DataGrid,
    Button,
    MatTooltip,
  ],
  templateUrl: './cuenta-por-pagar-hist-movimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentaPorPagarHistMovimientoComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CuentaPorPagarHistMovimientoComponent>);
  readonly data = inject<{ idCuentaPorPagar: number }>(MAT_DIALOG_DATA);
  private dialogSvc = inject(DialogService);
  private useCase = inject(CUENTA_POR_PAGAR_HTTP_TOKEN);

  columnsDefs: DataGridColumn[] = [
    { field: 'op', header: 'Op.' },
    { field: 'index', header: 'Nro.' },
    { field: 'serieComprobante', header: 'Nro. Doc.' },
    { field: 'fechaEmision', header: 'Fecha Registro' },
    { field: 'total', header: 'Total' },
    { field: 'nombreEstado', header: 'Estado' },
    { field: 'expand', header: '' },
  ];

  cuentaPorPagar = {} as Partial<CuentaPorPagarLista>;

  comprobantesEgreso: ComprobanteEgresoLista[] = [];
  tempHistorialPagos = signal<HistorialPagoLista[]>([]);
  historialPagos = signal<HistorialPagoLista[]>([]);
  tempPagosDetalle = signal<unknown[]>([]);

  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.useCase
      .getHistorialMovimientoByIdCuentaPorPagar(this.data.idCuentaPorPagar)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(
        (response: {
          comprobantesEgreso: ComprobanteEgresoLista[];
          historialPagos: HistorialPagoLista[];
          pagosDetalle: unknown[];
        }) => {
          this.comprobantesEgreso = response.comprobantesEgreso;
          this.tempHistorialPagos.set(response.historialPagos);
          this.tempPagosDetalle.set(response.pagosDetalle);
        },
      );
  }

  onShowExpanded(row: ComprobanteEgresoLista) {
    this.historialPagos.set(
      this.tempHistorialPagos().filter(
        (item) => item.idComprobanteEgreso === row.idComprobanteEgreso,
      ),
    );
  }

  onHideExpanded() {
    this.historialPagos.set([]);
  }

  onRowClick(_event: { rowData: ComprobanteEgresoLista }) {
    // Implementar lógica de click en fila si es necesario
  }

  toggleExpand(data: ComprobanteEgresoLista) {
    if (this.historialPagos().length > 0) {
      this.onHideExpanded();
    } else {
      this.onShowExpanded(data);
    }
  }

  downloadDocument(_data: ComprobanteEgresoLista) {
    // Implementar lógica para descargar documento
  }

  deleteDocument(_data: ComprobanteEgresoLista) {
    // Implementar lógica para eliminar documento
  }

  openPagoDetalle(item: HistorialPagoLista) {
    this.dialogSvc.open(PagoDetalleModalComponent, {
      size: 'md',
      data: this.tempPagosDetalle().filter((pd: any) => pd.idPago === item.idPago),
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
