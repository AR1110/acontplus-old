import { Component, computed, inject, model, ChangeDetectionStrategy } from '@angular/core';

import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
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
import { DataGrid, DataGridColumn } from '@acontplus/ng-components';

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
    FormsModule,
    MatSlideToggleModule,
    NgxMaskDirective,
    CitySearchComponent,
    DataGrid,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './forma-pago.component.html',
  providers: [provideNativeDateAdapter()],
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormaPagoComponent {
  readonly dialogRef = inject(MatDialogRef<FormaPagoComponent>);
  comprobanteEgresoStore = inject(ComprobanteEgresoStore);

  title = computed(() => `Total a pagar: $${this.comprobanteEgresoStore.saldo()}`);

  valorAbono = model(this.comprobanteEgresoStore.saldo());

  docDataSource: unknown[] = [];

  columnsDefs: DataGridColumn[] = [
    { field: 'op', header: 'Op.' },
    { field: 'nombreDoc', header: 'Tipo Doc.' },
    { field: 'nroDoc', header: 'Nro. Doc.' },
    { field: 'fechaEmision', header: 'Fecha Emisión' },
    { field: 'total', header: 'Total' },
  ];

  close() {
    this.comprobanteEgresoStore.updateDataFormaPago(getDataFormaPagoState());

    this.dialogRef.close();
  }
}
