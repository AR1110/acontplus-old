import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { EntidadFinanciera } from '@accounting/interfaces/entidad-financiera.interface';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { DialogService } from '@core/services/dialog.service';
import { FormaPagoComponent } from '@accounting/comprobante-egreso/components/forma-pago/forma-pago.component';
import { ComprobanteEgresoStore } from '@accounting/comprobante-egreso/comprobante-egreso.store';
import { ToasterService } from '@core/services/toaster.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CuotaPorPagarLista } from '@modules/accounting/interfaces/cuota-por-pagar.interface';
import Swal from 'sweetalert2';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

@Component({
  selector: 'app-comprobante-ingreso-lote',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe,
    MatDynamicTableComponent,
    MatCustomDialogComponent,
  ],
  templateUrl: './comprobante-egreso-lote.component.html',
  styles: ``,
})
export class ComprobanteEgresoLoteComponent {
  readonly dialogRef = inject(MatDialogRef<ComprobanteEgresoLoteComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private dialogSvc = inject(DialogService);
  private tS = inject(ToasterService);
  comprobanteEgresoStore = inject(ComprobanteEgresoStore);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nroCuota', label: 'Nro. Cuota', type: 'string' },
    { key: 'cuota', label: 'Cuota', type: 'string' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  cuentaPorPagarColumnsDefs: ColumnDefinition[] = [
    { key: 'nombreDoc', label: 'Op.', type: 'string' },
    { key: 'nroDocumento', label: 'Nro.', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'expand', label: '', type: 'string' },
  ];
  cuentaPorPagaeColumns: string[] = this.cuentaPorPagarColumnsDefs.map(
    (colDef) => colDef.key,
  );

  ngOnInit() {
    this.comprobanteEgresoStore.updateMultipleFields({
      dataCuentaPorPagar: this.data.dataCuentaPorPagar,
      cuentasPorPagar: structuredClone(this.data.cuentasPorPagar),
      cuentasPorPagarCopy: structuredClone(this.data.cuentasPorPagar),
    });
    this.comprobanteEgresoStore.loadDataForm(
      this.data.dataCuentaPorPagar.idProveedor as number,
    );
  }

  openFormaPago(row: EntidadFinanciera) {
    if (this.comprobanteEgresoStore.saldo() === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'No tienes saldo pendiente',
      });
      return;
    }

    this.comprobanteEgresoStore.updateDataEntidadFinanciera(row);
    this.dialogSvc.open(FormaPagoComponent, {
      size: this.comprobanteEgresoStore.esDoc() ? 'xl' : 'md',
    });
  }

  verPagoDetalle(data: CuotaPorPagarLista) {
    // Filtrar los pagos relacionados con la cuota seleccionada
    const tempPagosDetalle = this.comprobanteEgresoStore
      .pagosDetalle()
      .filter((item) => item.idCuotaPorPagar === data.idCuotaPorPagar);

    // Construir el detalle de los pagos con la información adicional
    const infoPagosDetalle = tempPagosDetalle.map((pd) => {
      const dataPago = this.comprobanteEgresoStore
        .formasPago()
        .find((item) => item.secuencial === pd.secuencial);

      return {
        ...pd,
        subEntidadFinanciera: dataPago?.nombreFormaPago || 'N/A', // Valor predeterminado si no existe
      };
    });

    // Generar el contenido HTML de la tabla
    const tableRows = infoPagosDetalle
      .map(
        (item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.subEntidadFinanciera}</td>
                <td>${item.abono}</td>
                <td>${item.saldo}</td>
                <td>${item.esPosfechado ? 'Sí' : 'No'}</td>
            </tr>
        `,
      )
      .join(''); // Unir las filas en una cadena de texto

    // Mostrar la tabla en un modal usando SweetAlert
    Swal.fire({
      icon: 'info',
      title: `<span>Cuota:</span> $${data.cuota}`,
      width: 600,
      html: `
            <table class="table table-striped table-sm color-bordered-table info-bordered-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Entidad Financiera</th>
                        <th>Abono</th>
                        <th>Saldo</th>
                        <th>PosFechado</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `,
    });
  }


  async save() {
    const { formasPago, pagosDetalle } = this.comprobanteEgresoStore;

    let valorAbonoInput = formasPago().reduce((acc, curr) => acc + curr.valorAbonoInput, 0)
    let totalAbonoCuota = formasPago().reduce((acc, curr) => acc + curr.abono, 0)

    if (formasPago().length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese al menos una forma de pago'
      })
      return
    }

    if (formasPago().some(item => pagosDetalle().some(pd => pd.secuencial !== item.secuencial))) {
      this.tS.toastr({
        type: 'warning',
        message: 'Secuencial de abono no corresponden con el abono realizado a las cuotas'
      })
      return
    }

    if (valorAbonoInput <= 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'El abono ingresado en las formas de pago no puede ser igual o menor a 0.'
      });
      return;
    }

    if (totalAbonoCuota <= 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'El abono de la cuota ingresado en las formas de pago no puede ser igual o menor a 0.'
      });
      return;
    }



    const { isConfirmed } = await Swal.fire({
      title: '<small>Guardar Pago</small>',
      html: "¿Estas seguro de guardar este pago ahora? ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!',
      cancelButtonText: 'No, cancelar!'
    })

    if (!isConfirmed) return








  }

  closeDialog() {
    this.dialogRef.close();
  }
}
