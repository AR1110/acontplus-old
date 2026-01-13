import { Component, inject, signal, OnInit } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { finalize } from 'rxjs';
import { CuentaPorPagarLista } from '@accounting/data/models/cuenta-por-pagar.model';
import { DynamicCard } from '@acontplus/ng-components';
import { HistorialPagoLista } from '@accounting/comprobante-egreso/domain/historial-pago.model';
import { MatDivider } from '@angular/material/divider';
import { DialogService } from '@core/services/dialog.service';
import { PagoDetalleModalComponent } from '@accounting/ui/cuenta-por-pagar-page/components/pago-detalle-modal/pago-detalle-modal.component';
import { ComprobanteEgresoLista } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
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
    MatDynamicTableComponent,
    MatTooltip,
  ],
  templateUrl: './cuenta-por-pagar-hist-movimiento.component.html',
  styles: ``,
})
export class CuentaPorPagarHistMovimientoComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CuentaPorPagarHistMovimientoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private dialogSvc = inject(DialogService);
  private useCase = inject(CUENTA_POR_PAGAR_HTTP_TOKEN);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'serieComprobante', label: 'Nro. Doc.', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Registro', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
    { key: 'expand', label: '', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  cuentaPorPagar = {} as Partial<CuentaPorPagarLista>;

  comprobantesEgreso = new MatTableDataSource<ComprobanteEgresoLista>([]);
  tempHistorialPagos = signal<HistorialPagoLista[]>([]);
  historialPagos = signal<HistorialPagoLista[]>([]);
  tempPagosDetalle = signal<any[]>([]);

  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.useCase
      .getHistorialMovimientoByIdCuentaPorPagar(this.data.idCuentaPorPagar)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.comprobantesEgreso = new MatTableDataSource(response.comprobantesEgreso);
        this.tempHistorialPagos.set(response.historialPagos);
        this.tempPagosDetalle.set(response.pagosDetalle);
      });
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

  openPagoDetalle(item: HistorialPagoLista) {
    this.dialogSvc.open(PagoDetalleModalComponent, {
      size: 'md',
      data: this.tempPagosDetalle().filter((pd) => pd.idPago === item.idPago),
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
