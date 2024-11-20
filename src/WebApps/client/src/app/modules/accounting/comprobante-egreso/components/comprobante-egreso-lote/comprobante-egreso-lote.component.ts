import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';

import {EntidadFinanciera} from "@accounting/interfaces/entidad-financiera.interface";
import {CurrencyPipe} from "@angular/common";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {DialogService} from "@core/services/dialog.service";
import {FormaPagoComponent} from "@accounting/comprobante-egreso/components/forma-pago/forma-pago.component";
import {ComprobanteEgresoStore} from "@accounting/comprobante-egreso/comprobante-egreso.store";

@Component({
  selector: 'app-comprobante-ingreso-lote',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule, MatDividerModule,
    CustomContainerDialogComponent, CurrencyPipe,
    MatDynamicTableComponent
  ],
  templateUrl: './comprobante-egreso-lote.component.html',
  styles: `


  `
})
export class ComprobanteEgresoLoteComponent {

  readonly dialogRef = inject(MatDialogRef<ComprobanteEgresoLoteComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private dialogSvc = inject(DialogService);
  comprobanteEgresoStore = inject(ComprobanteEgresoStore)


  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nroCuota', label: 'Nro. Cuota', type: 'string' },
    { key: 'cuota', label: 'Cuota', type: 'string' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);


  ngOnInit(){
    this.comprobanteEgresoStore.updateCuentaPorPagar(this.data.dataCuentaPorPagar, this.data.cuentasPorPagar);
    this.comprobanteEgresoStore.loadDataForm(this.data.dataCuentaPorPagar.idProveedor as number)

  }


  openFormaPago(row: EntidadFinanciera){
    this.comprobanteEgresoStore.updateDataEntidadFinanciera(row)
    this.dialogSvc.open(FormaPagoComponent, {
      size: 'md'
    })

  }

  closeDialog(){
    this.dialogRef.close()
  }

}
