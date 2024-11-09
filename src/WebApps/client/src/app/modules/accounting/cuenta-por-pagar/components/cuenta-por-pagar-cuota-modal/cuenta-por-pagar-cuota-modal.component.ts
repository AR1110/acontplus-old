import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { MatMenuModule } from '@angular/material/menu';
import { CuentaPorPagarService } from '../../cuenta-por-pagar.service';
import { finalize, forkJoin } from 'rxjs';
import { CuentaPorPagarCuotaConfig } from '../../cuenta-por-pagar.interface';
import { TiempoCreditoSelectHtmlOnly } from '@modules/accounting/interfaces/tiempo-credito.interface';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cuenta-por-pagar-cuota-modal',
  standalone: true,
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
    NgxMaskDirective ,
    CustomContainerDialogComponent,
    CustomTableContainerComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './cuenta-por-pagar-cuota-modal.component.html',
  styles: `




  `
})
export class CuentaPorPagarCuotaModalComponent {
  readonly dialogRef = inject(MatDialogRef<CuentaPorPagarCuotaModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  private cuentaPorPagarSvc = inject(CuentaPorPagarService);



  loading = signal(false)
  tiemposCredito = signal<TiempoCreditoSelectHtmlOnly[]>([])


  displayedColumns: string[] = ['position', 'cuota', 'fechaVencimiento',  ];
  dataSource = signal<CuentaPorPagarCuotaConfig[]>([]);

  private initLoad() {
    return forkJoin([
      this.cuentaPorPagarSvc.getCuotasData(),
      this.cuentaPorPagarSvc.getCuotasConfigByIdCuentaPorPagar(this.data.idCuentaPorPagar)
    ]);
  }


  ngOnInit(){
    this.loading.set(true)

    this.initLoad()
      .pipe(
        finalize(() => this.loading.set(false)),
      )
    .subscribe(result=>{
      const [responseCuotaData, responseCuotaConfig] = result;
      this.tiemposCredito.set(responseCuotaData.tiemposCredito)
      this.dataSource.set(responseCuotaConfig.data)

    })
  }


  closeDialog() {
    this.dialogRef.close();
  }
}
