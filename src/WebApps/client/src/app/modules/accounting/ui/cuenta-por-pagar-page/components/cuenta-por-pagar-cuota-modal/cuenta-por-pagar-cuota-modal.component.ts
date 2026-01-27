import { Component, computed, inject, model, signal, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { finalize, forkJoin } from 'rxjs';
import { CuentaPorPagarCuotaConfig } from '@accounting/data/models/cuenta-por-pagar.model';
import { TiempoCreditoSelectHtmlOnly } from '@accounting/shared/models/tiempo-credito.interface';
import { NgxMaskDirective } from 'ngx-mask';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { roundNumber } from '@core/utils/round-number.utils';
import { DECIMALS } from '@core/constants/global.constants';
import { CUENTA_POR_PAGAR_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { NumberUtil } from '@shared/utils/number.util';
import { formatDate } from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';

@Component({
  selector: 'app-cuenta-por-pagar-page-cuota-modal',
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
    ReactiveFormsModule,
    NgxMaskDirective,
    MatDialogContent,
    MatDialogActions,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './cuenta-por-pagar-cuota-modal.component.html',
  styles: `
    tr.mat-mdc-footer-row td {
      font-weight: bold;
    }
  `,
})
export class CuentaPorPagarCuotaModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CuentaPorPagarCuotaModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private useCase = inject(CUENTA_POR_PAGAR_HTTP_TOKEN);
  private tS = inject(ToastrNotificationService);

  loading = signal(false);
  tiemposCredito = signal<TiempoCreditoSelectHtmlOnly[]>([]);

  visibleColumns: string[] = ['position', 'nroCuota', 'cuota', 'fechaVencimiento'];
  dataSource = signal<CuentaPorPagarCuotaConfig[]>([]);

  dataForm = model({
    tiempoCreditoId: 0,
  });
  configDate = new FormControl<null | Date>(null);
  configDateOptions = {
    END_MONTH: 'END_MONTH',
    SAME_DAY: 'SAME_DAY',
  } as const;
  dataFormClone = model(structuredClone(this.dataForm()));

  nuevoTotal = computed(() => {
    const valorCalculado = this.dataSource().reduce((prev, curr) => prev + Number(curr.cuota), 0);
    console.log(valorCalculado);
    console.log(this.dataSource());
    return roundNumber(valorCalculado, DECIMALS.DOS);
  });

  valorDiferencia = computed(() => {
    const valorResiduo = this.data.total - this.nuevoTotal();
    return roundNumber(valorResiduo, DECIMALS.DOS);
  });

  private initLoad() {
    console.log(this.data);
    return forkJoin({
      responseCuotaData$: this.useCase.getCuotasData(),
      responseCuotaConfig$: this.useCase.getCuotasConfigByIdCuentaPorPagar(
        this.data.idCuentaPorPagar,
      ),
    });
  }

  ngOnInit() {
    this.loading.set(true);
    this.setDataForm('tiempoCreditoId', this.data.idTiempoCredito);
    this.configDate.setValue(formatDate(this.data.fechaEmision));
    this.dataFormClone.set(structuredClone(this.dataForm()));

    this.initLoad()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((result) => {
        console.log(result);
        const { responseCuotaData$, responseCuotaConfig$ } = result;
        this.tiemposCredito.set(responseCuotaData$.tiemposCredito);
        this.dataSource.set(responseCuotaConfig$.data);
      });
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
    const dataTiempoCredito = this.tiemposCredito().find(
      (item) => item.idTiempoCredito === this.dataForm().tiempoCreditoId,
    );
    if (!dataTiempoCredito) return;
    const { numeroCuota } = dataTiempoCredito;

    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `Está seguro/a de generar <b>${numeroCuota} </b>  ${numeroCuota > 1 ? 'cuotas' : 'cuota'}`,
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!isConfirmed) {
      this.setDataForm('tiempoCreditoId', this.dataFormClone().tiempoCreditoId);
      return;
    }

    this.loading.set(true);
    this.useCase
      .generarCuotas({
        idCuentaPorPagar: this.data.idCuentaPorPagar,
        tiempoCreditoId: this.dataForm().tiempoCreditoId,
        codigoEstado: this.data.codigoEstado,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        if (response.code === '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          this.getDataConfigCuotas();
        }
      });
  }

  private getDataConfigCuotas() {
    this.loading.set(true);
    this.useCase
      .getCuotasConfigByIdCuentaPorPagar(this.data.idCuentaPorPagar)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.dataSource.set(response.data);
      });
  }

  private isConfigDateValid(sameDay?: keyof typeof this.configDateOptions) {
    if (!isValidField(this.configDate.value)) {
      this.tS.show({
        type: 'warning',
        message: 'Configuración fecha inválida',
      });
      return;
    }
    if (this.configDate.value?.getFullYear().toString().length !== 4) {
      this.tS.show({
        type: 'warning',
        message: 'El Formato del Año es incorrecto',
      });
      return;
    }

    if (this.configDateOptions.SAME_DAY === sameDay && this.configDate.value?.getDate() >= 28) {
      this.tS.show({
        type: 'warning',
        message: 'Para la opción  "Mismo Día", el día tiene que ser menor a 28 días!',
      });
      return;
    }
    return true;
  }

  configureEndOfMonthDate() {
    if (!this.isConfigDateValid(this.configDateOptions.SAME_DAY)) return;

    const configDate = structuredClone(this.configDate.value);

    if (!configDate) return;

    const resultCuotas = this.dataSource().map((item) => {
      // Obtener el último día del mes actual
      const lastDayOfMonth = new Date(
        configDate.getFullYear(),
        configDate.getMonth() + 1,
        0,
      ).getDate();

      // Establecer la fecha actual en el último día del mes actual
      configDate.setDate(lastDayOfMonth);

      // Agregar la fecha vecimiento
      item.fechaVencimiento = new Date(configDate);

      // Establecer la fecha actual en el primer día del mes siguiente
      configDate.setDate(1);
      configDate.setMonth(configDate.getMonth() + 1);
      return item;
    });
    this.dataSource.set(resultCuotas);
  }

  configureSameDayDate() {
    if (!this.isConfigDateValid()) return;

    const configDate = structuredClone(this.configDate.value);

    if (!configDate) return;

    const daysInMonth = new Date(configDate.getFullYear(), configDate.getMonth() + 1, 0).getDate();
    const dayOfMonth = configDate.getDate() <= daysInMonth ? configDate.getDate() : daysInMonth;

    const resultCuotas = this.dataSource().map((item, index) => {
      const newDate = new Date(configDate);
      newDate.setMonth(configDate.getMonth() + index++);
      newDate.setDate(dayOfMonth);
      item.fechaVencimiento = newDate;
      return item;
    });
    this.dataSource.set(resultCuotas);
  }

  calcularValorCuota($event: any, row: CuentaPorPagarCuotaConfig) {
    $event.stopPropagation();

    const rowIndex = this.dataSource().indexOf(row);

    const cuotasIndexMenor = this.dataSource().filter((_, index) => index <= rowIndex);
    const cuotasIndexMayor = this.dataSource().filter((_, index) => index > rowIndex);

    console.log(cuotasIndexMenor);
    console.log(cuotasIndexMayor);

    let totalCuotaIndexMenor = cuotasIndexMenor
      .map((val) => Number(val.cuota))
      .reduce((prev, curr) => prev + curr, 0);

    totalCuotaIndexMenor = roundNumber(totalCuotaIndexMenor, DECIMALS.CINCO);

    if (totalCuotaIndexMenor > this.data.total) {
      this.tS.show({
        type: 'warning',
        message: 'El valor de la cuota tiene que ser menor al Total del Documento',
      });
    }

    if (cuotasIndexMayor.length > 0) {
      const total = this.data.total - totalCuotaIndexMenor; //Total Cuota - total Factura

      const numeroCuota = cuotasIndexMayor.length;
      const valorCuota = total / numeroCuota;

      const nroCuotaIndex = Number(row.nroCuota); // Convertir `nroCuota` a número para evitar problemas con el tipo

      const resultsCuotas = this.dataSource().map((item, index) => {
        let { cuota, ...restItem } = item;

        // Asignar `cuota` solo si `index` es mayor que `nroCuotaIndex`
        if (!isNaN(nroCuotaIndex) && index > rowIndex) {
          cuota = roundNumber(valorCuota, DECIMALS.CINCO);
        }

        return {
          ...restItem,
          cuota,
        };
      });
      this.dataSource.set(resultsCuotas);
    }
  }

  calcularValorEntrada($event: any, valorEntrada: any) {
    try {
      $event.stopPropagation();
      // Valida si el valor de entrada es nulo, indefinido o vacío
      if (!NumberUtil.esNumeroValido(valorEntrada)) {
        valorEntrada = 0;
      }

      // Calcular el total y la cuota
      const numeroCuota =
        this.tiemposCredito().find(
          (item) => item.idTiempoCredito === this.dataForm().tiempoCreditoId,
        )?.numeroCuota || 0;
      let total = this.data.total - parseFloat(valorEntrada);
      total = roundNumber(total, DECIMALS.DOS);

      let valorCuota = total / numeroCuota;
      valorCuota = roundNumber(valorCuota, DECIMALS.CINCO);

      // Actualizar cuotas de forma más eficiente con map
      const cuotasAfectadas = this.dataSource().map((item) => {
        if (item.nroCuota === 0) {
          item.cuota = valorCuota === 0 ? this.data.total : valorEntrada;
        } else {
          item.cuota = valorCuota;
        }
        return item;
      });

      this.dataSource.set(cuotasAfectadas);
    } catch (error) {
      console.error('Error al calcular el valor de entrada:', error);
    }
  }

  save() {
    // const [message, infrastructure] = this.cuentaPorPagarSvc.validarCamposActualizarCuota(
    //   { cuotas: this.dataSource() },
    // );
    //
    // if (message) {
    //   this.tS.toastr({
    //     type: 'warning',
    //     message,
    //   });
    //   throw new Error(message);
    // }

    Swal.fire({
      icon: 'warning',
      html: ` Está seguro/a de guardar las cuotas `,
      showConfirmButton: true,
      confirmButtonText: 'Si ',
      showCancelButton: true,
      cancelButtonText: 'No ',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(false);
        // this.cuentaPorPagarSvc.actualizarCuotas(this.infrastructure.idCuentaPorPagar, this.dataSource())
        // .pipe(finalize(()=>this.loading.set(false)))
        // .subscribe(response=>{
        //   if(response.code==="0"){
        //     this.tS.toastr({
        //       type: 'warning',
        //       message: response.message
        //     })
        //   }

        //   if(response.code==="1"){
        //     this.tS.toastr({
        //       type: 'success',
        //       message: response.message
        //     })
        //     this.getDataConfigCuotas()
        //   }

        // })
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
