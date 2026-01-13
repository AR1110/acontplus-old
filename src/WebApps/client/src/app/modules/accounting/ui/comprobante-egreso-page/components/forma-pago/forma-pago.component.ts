import { Component, computed, inject, model } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ComprobanteEgresoStore,
  getDataFormaPagoState,
} from '@accounting/store/comprobante-egreso.store';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CitySearchComponent } from '@accounting/ui/comprobante-egreso-page/components/city-search/city-search.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-forma-pago',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatCustomDialogComponent,
    FormsModule,
    MatSlideToggleModule,
    NgxMaskDirective,
    CitySearchComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './forma-pago.component.html',
  providers: [provideNativeDateAdapter()],
  styles: ``,
})
export class FormaPagoComponent {
  readonly dialogRef = inject(MatDialogRef<FormaPagoComponent>);
  comprobanteEgresoStore = inject(ComprobanteEgresoStore);

  title = computed(() => `Total a pagar: $${this.comprobanteEgresoStore.saldo()}`);

  valorAbono = model(this.comprobanteEgresoStore.saldo());

  docDataSource = new MatTableDataSource<any>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nombreDoc', label: 'Tipo Doc.', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Doc.', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  close() {
    this.comprobanteEgresoStore.updateDataFormaPago(getDataFormaPagoState());

    this.dialogRef.close();
  }
}
