import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard, DataGrid, DataGridColumn } from '@acontplus/ng-components';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DialogService } from '@core/services/dialog.service';
import { FormaPagoComponent } from '@accounting/ui/comprobante-egreso-page/components/forma-pago/forma-pago.component';
import { ComprobanteEgresoStore } from '@accounting/comprobante-egreso/application/store/comprobante-egreso.store';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CuotaPorPagarLista } from '@accounting/data/models/cuota-por-pagar.interface';
import Swal from 'sweetalert2';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

import { obtenerCuotasPorPagarEstadoUtil } from '@accounting/comprobante-egreso/application/comprobante-egreso/obtener-cuotas-por-pagar-estado.util';
import { obtenerCuentasPorPagarEstado } from '@accounting/comprobante-egreso/application/comprobante-egreso/obtener-cuentas-por-pagar-estado.util';
import { FormsModule } from '@angular/forms';
import { ComprobanteEgresoUseCase } from '@accounting/comprobante-egreso/application/use-cases/comprobante-egreso.use-case';
import { NotificationService } from '@acontplus/ng-notifications';

@Component({
  selector: 'app-comprobante-ingreso-lote',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    DynamicCard,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe,
    DataGrid,
    MatCustomDialogComponent,
  ],
  templateUrl: './comprobante-egreso-lote.component.html',
  styles: ``,
})
export class ComprobanteEgresoLoteComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ComprobanteEgresoLoteComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private dialogSvc = inject(DialogService);
  private notificationSvc = inject(NotificationService);
  comprobanteEgresoStore = inject(ComprobanteEgresoStore);
  private useCase = inject(ComprobanteEgresoUseCase);

  columns: DataGridColumn[] = [
    {
      header: 'Op.',
      field: 'actions',
      sortable: false,
    },
    {
      header: 'Nro. Cuota',
      field: 'nroCuota',
      sortable: true,
    },
    {
      header: 'Cuota',
      field: 'cuota',
      sortable: true,
    },
    {
      header: 'Abono',
      field: 'abono',
      sortable: true,
    },
    {
      header: 'Saldo',
      field: 'saldo',
      sortable: true,
    },
    {
      header: 'Estado',
      field: 'nombreEstado',
      sortable: true,
    },
  ];

  cuentaPorPagarColumns: DataGridColumn[] = [
    {
      header: 'Op.',
      field: 'nombreDoc',
      sortable: false,
    },
    {
      header: 'Nro.',
      field: 'nroDocumento',
      sortable: true,
    },
    {
      header: 'Total',
      field: 'total',
      sortable: true,
    },
    {
      header: '',
      field: 'expand',
      sortable: false,
    },
  ];

  ngOnInit() {
    this.comprobanteEgresoStore.updateMultipleFields({
      dataCuentaPorPagar: this.data.dataCuentaPorPagar,
      cuentasPorPagar: structuredClone(this.data.cuentasPorPagar),
      cuentasPorPagarCopy: structuredClone(this.data.cuentasPorPagar),
    });
    this.comprobanteEgresoStore.loadDataForm(this.data.dataCuentaPorPagar.idProveedor as number);
  }

  openFormaPago(row: EntidadFinanciera) {
    if (this.comprobanteEgresoStore.saldo() === 0) {
      this.notificationSvc.warning({ message: 'No tienes saldo pendiente' });
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
    const { formasPago, pagosDetalle, cuentasPorPagarHistorial, estadosPago } =
      this.comprobanteEgresoStore;

    const cuentasPorPagarEstado = obtenerCuentasPorPagarEstado({
      pagosDetalle: pagosDetalle(),
      cuentasPorPagarHistorial: cuentasPorPagarHistorial(),
      estadosPago: estadosPago(),
    });

    const cuotasPorPagarEstado = obtenerCuotasPorPagarEstadoUtil({
      pagosDetalle: pagosDetalle(),
      estadosPago: estadosPago(),
    });

    const valorAbonoInput = formasPago().reduce((acc, curr) => acc + curr.valorAbonoInput, 0);
    const totalAbonoCuota = formasPago().reduce((acc, curr) => acc + curr.abono, 0);

    if (formasPago().length === 0) {
      this.notificationSvc.warning({ message: 'Ingrese al menos una forma de pago' });
      return;
    }

    // Filtrar las secuencias que no existen en los datos de referencia
    const secuenciasInvalidas = formasPago().filter(
      (dato) => !pagosDetalle().some((referencia) => referencia.secuencial === dato.secuencial),
    );

    if (secuenciasInvalidas.length > 0) {
      this.notificationSvc.warning({ message: 'Se encontraron secuencias inválidas' });
      return;
    }

    if (valorAbonoInput <= 0) {
      this.notificationSvc.warning({
        message: 'El abono ingresado en las formas de pago no puede ser igual o menor a 0.',
      });
      return;
    }

    if (totalAbonoCuota <= 0) {
      this.notificationSvc.warning({
        message:
          'El abono de la cuota ingresado en las formas de pago no puede ser igual o menor a 0.',
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: '<small>Guardar Pago</small>',
      html: '¿Estas seguro de guardar este pago ahora? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!',
      cancelButtonText: 'No, cancelar!',
    });

    if (!isConfirmed) return;

    const data = {
      dataCuentaPorPagar: this.comprobanteEgresoStore.dataCuentaPorPagar(),
      total: valorAbonoInput,
      formasPago: formasPago(),
      pagosDetalle: pagosDetalle(),
      cuentasPorPagarEstado,
      cuotasPorPagarEstado,
      cuentasPorPagarHistorial: cuentasPorPagarHistorial(),
    };

    this.useCase.post(data).subscribe((response) => {
      if (response.code === '0') {
        this.notificationSvc.warning({ message: response.message });
      }

      if (response.code === '1') {
        this.notificationSvc.success({ message: response.message });
        this.dialogRef.close({
          isSave: true,
        });
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
