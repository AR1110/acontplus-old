import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';
import {   provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { CuentaPorPagarService } from '../../cuenta-por-pagar.service';
import { finalize, forkJoin } from 'rxjs';
import { CuentaPorPagarCuotaConfig } from '../../interfaces/cuenta-por-pagar.interface';
import { TiempoCreditoSelectHtmlOnly } from '@modules/accounting/interfaces/tiempo-credito.interface';
import { NgxMaskDirective } from 'ngx-mask';
import Swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-cuenta-por-pagar-cuota-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    CustomContainerDialogComponent,
    NgxMaskDirective
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
  private tS = inject(ToasterService)



  loading = signal(false)
  tiemposCredito = signal<TiempoCreditoSelectHtmlOnly[]>([])


  displayedColumns: string[] = ['position', 'cuota', 'fechaVencimiento',];
  dataSource = signal<CuentaPorPagarCuotaConfig[]>([]);

  dataForm = model({
    tiempoCreditoId: 0
  })
  dataFormClone = structuredClone(this.dataForm)

  private initLoad() {
    return forkJoin([
      this.cuentaPorPagarSvc.getCuotasData(),
      this.cuentaPorPagarSvc.getCuotasConfigByIdCuentaPorPagar(this.data.idCuentaPorPagar)
    ]);
  }


  ngOnInit() {
    this.loading.set(true)

    this.initLoad()
      .pipe(
        finalize(() => this.loading.set(false)),
      )
      .subscribe(result => {
        const [responseCuotaData, responseCuotaConfig] = result;
        this.tiemposCredito.set(responseCuotaData.tiemposCredito)
        this.dataSource.set(responseCuotaConfig.data)

      })
  }

  async onChangeTiempoCredito() {
    let dataTiempoCredito = this.tiemposCredito().find(item => item.idTiempoCredito === this.dataForm().tiempoCreditoId);
    if (!dataTiempoCredito) return
    const { numeroCuota, } = dataTiempoCredito;

    let { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `Está seguro/a de generar <b>${numeroCuota} </b>  ${numeroCuota > 1 ? 'Cuotas' : 'Cuota'}`,
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
      allowOutsideClick: false,
      allowEscapeKey: false
    })

    if (!isConfirmed) {
      this.dataForm().tiempoCreditoId = this.dataFormClone().tiempoCreditoId;
      return
    }


    this.cuentaPorPagarSvc.generarCuota({
      id: this.data.id,
      tiempoCreditoId: this.dataForm().tiempoCreditoId,
      codigoEstado: this.data.codigoEstado
    }).subscribe(response => {
      if (response.code === "0") {
        this.tS.toastr({
          type: 'warning',
          message: response.message
        })
      }
      if (response.code === "1") {
        this.tS.toastr({
          type: 'success',
          message: response.message
        })
      }
    })

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
