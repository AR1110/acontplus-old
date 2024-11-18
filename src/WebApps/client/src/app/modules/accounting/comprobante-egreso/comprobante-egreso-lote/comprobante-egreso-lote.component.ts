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
import {ComprobanteEgresoService} from "@accounting/comprobante-egreso/comprobante-egreso.service";
import {pipe} from "rxjs";
import {finalize} from "rxjs/operators";
import {EntidadFinanciera} from "@accounting/interfaces/entidad-financiera.interface";
import {CurrencyPipe} from "@angular/common";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";

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
  private comprobanteEgresoSvc = inject(ComprobanteEgresoService)

  loading = signal(false);

  formasDePago = signal([
    {
      descripcion: 'EFECTIVO'
    },
    {
      descripcion: 'TRANSFERENCIAS'
    },
    {
      descripcion: 'TARJETA CREDITO'
    },
    {
      descripcion: 'DOCUMENTOS'
    }
  ])

  dataCuentaPorPagar = signal(this.data.dataCuentaPorPagar);
  cuentasPorPagar = signal(structuredClone(this.data.cuentasPorPagar));
  cuentasPorPagarCopy = signal(structuredClone(this.data.cuentasPorPagar));


  entidadesFinanciera = signal<EntidadFinanciera[]>([])


  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nroCuota', label: 'Nro. Cuota', type: 'string' },
    { key: 'cuota', label: 'Cuota', type: 'string' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  private  getDatForm(){
    this.loading.set(true)
    this.comprobanteEgresoSvc.getDatForm(this.dataCuentaPorPagar().idProveedor)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(response=>{
      this.entidadesFinanciera.set(response.entidadesFinanciera)
    })
  }

  ngOnInit(){
    console.log(this.cuentasPorPagar())
    this.getDatForm()
  }


  closeDialog(){
    this.dialogRef.close()
  }

}
