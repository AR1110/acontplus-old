import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { CuentaPorPagarService } from '../../cuenta-por-pagar.service';
import { finalize, forkJoin } from 'rxjs';
import { CuentaPorPagarCuotaConfig } from '../../interfaces/cuenta-por-pagar.interface';
import { TiempoCreditoSelectHtmlOnly } from '@modules/accounting/interfaces/tiempo-credito.interface';
import { NgxMaskDirective } from 'ngx-mask';
import Swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { roundNumber } from '@core/utils/round-number.utils';
import { DECIMALS } from '@core/constants/global.constants';

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
    MatInputModule,
    MatButtonModule,
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
  dataFormClone = model(structuredClone(this.dataForm()))

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
        console.log(this.dataSource())

      })
  }


  setDataForm<K extends keyof ReturnType<typeof this.dataForm>>(
    key: K,
    value: ReturnType<typeof this.dataForm>[K],
  ) {
    this.dataForm.update((ds) => {
      return {
        ...ds,
        [key]: value,
      };
    });
  }

  async onChangeTiempoCredito() {
    let dataTiempoCredito = this.tiemposCredito().find(item => item.idTiempoCredito === this.dataForm().tiempoCreditoId);
    if (!dataTiempoCredito) return
    const { numeroCuota, } = dataTiempoCredito;

    let { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `Está seguro/a de generar <b>${numeroCuota} </b>  ${numeroCuota > 1 ? 'cuotas' : 'cuota'}`,
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
      allowOutsideClick: false,
      allowEscapeKey: false
    })

    if (!isConfirmed) {
      this.setDataForm("tiempoCreditoId", this.dataFormClone().tiempoCreditoId)
      return
    }


    this.cuentaPorPagarSvc.generarCuota({
      idCuentaPorPagar: this.data.idCuentaPorPagar,
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
        this.getDataConfigCuotas()

      }
    })

  }

  private getDataConfigCuotas() {
    this.loading.set(true)
    this.cuentaPorPagarSvc.getCuotasConfigByIdCuentaPorPagar(this.data.idCuentaPorPagar)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(response => {
        this.dataSource.set(response.data)

      })
  }



  calcularValorCuota($event: any, row: CuentaPorPagarCuotaConfig) {
    $event.stopPropagation();


    let cuotasIndexMenor = this.dataSource().filter((_, index) => {
      const nroCuotaNumber = Number(row.nroCuota);

      return !isNaN(nroCuotaNumber) && index <= nroCuotaNumber;
    });


    let cuotasIndexMayor = this.dataSource().filter((_, index) => {
      const nroCuotaNumber = Number(row.nroCuota);

      return !isNaN(nroCuotaNumber) && index > nroCuotaNumber;
    });

    let totalCuotaIndexMenor = cuotasIndexMenor.map(val => Number(val.cuota)).reduce((prev, curr) => prev + curr, 0);

    if (totalCuotaIndexMenor > this.data.total) {
      this.tS.toastr({
        type: 'warning',
        message: 'El valor de la cuota tiene que ser menor al Total del Documento'
      })
    }


    if (cuotasIndexMayor.length > 0) {
      let total = this.data.total - totalCuotaIndexMenor; //Total Cuota - total Factura

      let numeroCuota = cuotasIndexMayor.length;
      let valorCuota = total / numeroCuota;

      const nroCuotaIndex = Number(row.nroCuota); // Convertir `nroCuota` a número para evitar problemas con el tipo

      const resultsCuotas = this.dataSource().map((item, index) => {
        let { cuota, ...restItem } = item;

        // Asignar `cuota` solo si `index` es mayor que `nroCuotaIndex`
        if (!isNaN(nroCuotaIndex) && index > nroCuotaIndex) {
          cuota = roundNumber(valorCuota, DECIMALS.CINCO);
        }

        return {
          ...restItem,
          cuota
        };
      });

      this.dataSource.set(resultsCuotas);

    }


  }



  save() {
    const [message, data] = this.cuentaPorPagarSvc.validarCamposActualizarCuota({ cuotas: this.dataSource() })

    if (message) {
      this.tS.toastr({
        type: 'warning',
        message
      })
      throw new Error(message);
    }

    Swal.fire({
      icon: 'warning',
      html: ` Está seguro/a de guardar las cuotas `,
      showConfirmButton: true,
      confirmButtonText: 'Si ',
      showCancelButton: true,
      cancelButtonText: 'No ',
      allowOutsideClick: false
    }).then(result => {
      if (result.isConfirmed) {
        this.loading.set(false)
        this.cuentaPorPagarSvc.actualizarCuotas(this.data.idCuentaPorPagar, this.dataSource())
        .pipe(finalize(()=>this.loading.set(false)))
        .subscribe(response=>{
          if(response.code==="0"){
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }

          if(response.code==="1"){
            this.tS.toastr({
              type: 'success',
              message: response.message
            })
            this.getDataConfigCuotas()
          }

        })

      }
    })
  }


  closeDialog() {
    this.dialogRef.close();
  }
}
