import { formatDateToString } from '@/core/utils/date.util';
import { minus, plus } from '@/core/utils/decimal.util';
import { PaymentUtil } from '@/core/utils/payment.util';
import { roundNumber } from '@/core/utils/round-number.util';
import { playBeepSound, playClearSound } from '@/core/utils/sound.util';
import { isValidField, truncateNumber } from '@/core/utils/utils';
import { InputNumberDirective } from '@/directives/input-number.directive';
import { DECIMALS, PaymentTypeCode } from '@/enums/main.enum';
import { BancoSelectHtmlOnly } from '@/models/contabilidad/banco.model';
import { PaymentSubType, PaymentType } from '@/models/contabilidad/payment-type.model';
import { Cobro, CuentaPorCobrarCalculado, DataCuentaPorCobrar } from '@/models/contabilidad/payment.model';
import { DialogService } from '@/services/dialog.service';
import { ComprobanteIngresoService } from '@/services/external/comprobante-ingreso.service';
import { ToasterService } from '@/services/toaster.service';
import { AsyncPipe } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import Swal from 'sweetalert2';

import { CustomContainerDialogComponent } from '../custom-container-dialog/custom-container-dialog.component';
import { CobrosAgregadoModalComponent } from './cobros-agregado-modal/cobros-agregado-modal.component';
import { PaymentCalculatorComponent } from './payment-calculator/payment-calculator.component';

let dataInitial = {
  posfechado: false,
  idEntidadFinanciera: 0,
  idSubEntidadFinanciera: 0,
  valorAbono: 0,
  idBanco: 0,
  idCiudad: 0,
  referencia: null,
  nro: null,
  lote: null,
  aprobacion: null,
  fechaEmision: new Date(),
  paymentTypeCode: null as null | undefined | string,
  observacion: '' as null | string
}


const _filterCiudadGroup = (opt: any[], value: string): string[] => {

  const filterValue = value.toLowerCase();

  return opt.filter(item => item.descripcion.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatSlideToggleModule,
    MatTabsModule,
    MatIconModule,
    MatBadgeModule,
    CustomContainerDialogComponent,
    PaymentCalculatorComponent,
    InputNumberDirective
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  private dialogSvc = inject(DialogService)
  readonly dialogRef = inject(MatDialogRef<PaymentComponent>);
  readonly matDialogData = inject<any>(MAT_DIALOG_DATA);
  private comprobanteIngresoSvc = inject(ComprobanteIngresoService)
  private tS = inject(ToasterService)
  private paymentUtil = new PaymentUtil(this.tS)

  private cuentasPorCobrarCalculado = signal<CuentaPorCobrarCalculado[]>([]);

  dataCuentaPorCobrar = signal<DataCuentaPorCobrar>({
    codEstab: '',
    idCliente: 0,
    identificacionComprador: '',
    razonSocialComprador: '',
    serieComprobante: '',
    importeTotal: 0,
    saldo: 0,
    oldSaldo: 0,
    abono: 0,
    fechaEmision: '',
    cambio: 0,
    oldAbono: 0,

  })


  paymentTypes = signal<PaymentType[]>([]);
  paymentSubTypes = signal<PaymentSubType[]>([]);
  bancos = signal<BancoSelectHtmlOnly[]>([])
  cobrosAgregados = signal<Cobro[]>([])

  formaCobro = model<'NORMAL' | 'MULTIPLE'>('NORMAL')

  data = structuredClone(dataInitial);

  valorAbono = model<string>('0');



  ciudadesGroup = signal<any[]>([])
  stateGroup: string = '';

  ciudadGroupOptions!: any[];

  //calculadora
  ultimoBotonClickeadoValueMoney = 0;

  saldoPendiente = signal(0)


  ngOnInit() {
    let { data } = this.matDialogData
    this.comprobanteIngresoSvc.getDataForm({ idCuentaPorCobrar: data.idCuentaPorCobrar }).subscribe({
      next: (response) => {
        const {
          entidadesFinanciera,
          bancos,
          ciudades,
          dataCuentaPorCobrar,
          cuentasPorCobrar,
          estadosCobro
        } = response;

        let dataPaymentType = entidadesFinanciera.find(ef => ef.codigo === PaymentTypeCode.EFE);
        let dataPaymentSubType = dataPaymentType?.subEntidadesFinanciera[0];

        this.dataCuentaPorCobrar.set(dataCuentaPorCobrar);

        this.data.paymentTypeCode = dataPaymentType?.codigo;
        this.data.idEntidadFinanciera = dataPaymentType?.idEntidadFinanciera ?? 0;
        this.data.idSubEntidadFinanciera = dataPaymentSubType?.idSubEntidadFinanciera ?? 0;


        this.cuentasPorCobrarCalculado.set(this.paymentUtil.calcularInteresMora(cuentasPorCobrar));

        this.paymentTypes.set(entidadesFinanciera);
        this.paymentSubTypes.set(dataPaymentType?.subEntidadesFinanciera ?? [])
        this.bancos.set(bancos)
        this.ciudadesGroup.set(ciudades);
        this.valorAbono.set(this.dataCuentaPorCobrar().saldo.toString())
        this.paymentUtil.setEstadoCobro(estadosCobro)

        this.saldoPendiente.set(this.dataCuentaPorCobrar().saldo)

        this.calcularCambio()
      },
      error: (err) => {
        console.log(err)
      }
    })

  }


  //inicio funciones calculadora
  onEqual(value:string){
    this.valorAbono.set(value)
    if (this.formaCobro() === 'NORMAL') {
      this.calcularCambio()
    }
    playBeepSound()
  }


  alcanzoDosDecimales() {
    if (this.valorAbono().toString().split(".")[1]?.length >= 2) return true
    return false;
  }

  appendValueMoney(value: number) {

    if (this.ultimoBotonClickeadoValueMoney === value) {
      this.valorAbono.update(e => (Number(e) + value).toString())
    } else {
      this.ultimoBotonClickeadoValueMoney = value;
      this.valorAbono.set(value.toString())
    }
    if (this.formaCobro() === 'NORMAL') {
      this.calcularCambio()
    }
    playBeepSound();


  }

  onClickNumber(value: number) {
    let valorAbono = this.valorAbono();
    if (valorAbono === "0" && (value === 0)) return
    if (this.alcanzoDosDecimales()) {
      valorAbono = (Number(valorAbono) + value).toString();
    } else {
      valorAbono = Number(valorAbono) === 0 ? value.toString() : (valorAbono + value).toString()
    }
    this.valorAbono.set(valorAbono)
    if (this.formaCobro() === 'NORMAL') {
      this.calcularCambio()
    }
    playBeepSound()
  }

  onClickPunto(punto: string) {
    if (punto === "." && this.valorAbono().toString().split(".").length > 1) return

    if (this.valorAbono().toString().split(".")[1]?.length >= 2) return

    this.valorAbono.update(e => {
      return e + punto;
    })

  }

  onClickClear() {
    this.ultimoBotonClickeadoValueMoney = 0;
    this.valorAbono.set('0');
    if (this.formaCobro() === 'NORMAL') {
      this.calcularCambio()
    }
    playClearSound();
  }

  // final funciones calculadora
  calcularCambio() {
    let cambio = 0;
    if (Number(this.valorAbono()) >= this.dataCuentaPorCobrar().saldo) {
      cambio = minus(Number(this.valorAbono()), this.dataCuentaPorCobrar().saldo, DECIMALS.DOS) as number
    }
    this.dataCuentaPorCobrar.update(e => {
      return {
        ...e,
        abono: Number(this.valorAbono()),
        cambio
      }
    })
  }

  onStateGroupInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.stateGroup = input.value;

    this.ciudadGroupOptions = this._filterGroup(input.value || '')
  }

  private _filterGroup(value: string): any[] {
    if (value) {
      return this.ciudadesGroup()
        .map(group => ({ provincia: group.provincia, ciudades: _filterCiudadGroup(group.ciudades, value) }))
        .filter(group => group.ciudades.length > 0);
    }

    return this.ciudadesGroup();
  }

  valueChangeCity(idCiudad: number) {
    this.data.idCiudad = idCiudad;
  }

  onChangePaymentType() {
    let dataPaymentType = this.paymentTypes().find(e => e.idEntidadFinanciera === this.data.idEntidadFinanciera);
    let dataPaymentSubType = dataPaymentType?.subEntidadesFinanciera[0];

    this.data.paymentTypeCode = dataPaymentType?.codigo;
    this.paymentSubTypes.set(dataPaymentType?.subEntidadesFinanciera ?? []);
    this.data.idSubEntidadFinanciera = dataPaymentSubType?.idSubEntidadFinanciera ?? 0;

    this.data.posfechado = false;
    this.data.valorAbono = this.dataCuentaPorCobrar().saldo;
    this.data.idBanco = 0;
    this.data.idCiudad = 0;
    this.data.referencia = null;
    this.data.nro = null;
    this.data.lote = null;
    this.data.aprobacion = null;
  }

  onChangeFormaCobro($event: any) {
    // this.data.valorAbono = 0;
    this.dataCuentaPorCobrar.update(e => {
      return {
        ...e,
        abono: 0,
        cambio: 0
      }
    })
    this.paymentUtil.clearData();
    this.cobrosAgregados.set([])
    this.saldoPendiente.set(this.dataCuentaPorCobrar().oldSaldo);
    this.valorAbono.set(this.dataCuentaPorCobrar().saldo.toString());
    //Todas las cuotas en su estado original
    for (let item of this.cuentasPorCobrarCalculado()) {
      item.cuotasCalculadas = structuredClone(item.cuotasCalculadasClone);
    }
    this.formaCobro.set($event.value);


    if (this.formaCobro() === 'NORMAL') {
      this.calcularCambio()
    }

  }

  onBlurValorAbono($event: any) {
    let value = $event.target.value;
    if (isNaN(value)) {
      this.tS.toastr({
        type: 'warning',
        message: 'No es un número'
      })
      return
    }
    if (this.formaCobro() === 'NORMAL') {

      this.valorAbono.set(truncateNumber(Number(value)).toString());
      this.calcularCambio();

    }

  }




  addPaymentType() {
    try {
      if (this.saldoPendiente() === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'No tiene saldos pendientes para cobrar'
        })
        return
      }
      if (isNaN(Number(this.valorAbono())) || Number(this.valorAbono()) === 0) {
        return
      }
      this.paymentUtil.setCuentasPorCobrar(this.cuentasPorCobrarCalculado());
      this.paymentUtil.setUniqueIndex(this.cobrosAgregados().length + 1);

   //   this.paymentUtil.setEsAbonoPosfechado(this.data.posfechado);
      this.paymentUtil.setValorAbono(Number(this.valorAbono()));

      //--------agregando abono ---
      this.paymentUtil.aplicarAbono();
      this.cuentasPorCobrarCalculado.set(this.paymentUtil.getCuentasPorCobrar())


      let abonoCuota = this.paymentUtil.getAbonoCuota();


      this.addDatosCobro(abonoCuota);

      this.calculoTotales();

      this.tS.toastr({
        type: 'success',
        message: 'Abonado Correctamente'
      })
    } catch (error) {
      console.log(error)
    }
  }


  private getDataFormaCobro() {

    let subEntidadFinanciera = this.paymentSubTypes().find(item => item.idSubEntidadFinanciera === this.data.idSubEntidadFinanciera);
    let formattedDateTime = formatDateToString(this.data.fechaEmision);

    let infoCobro = [{
      nro: this.data.nro,
      lote: this.data.lote,
      aprobacion: this.data.aprobacion,
      referencia: this.data.referencia
    }]

    return {
      idEntidadFinanciera: this.data.idEntidadFinanciera,
      idSubEntidadFinanciera: this.data.idSubEntidadFinanciera,
      idBanco: this.data.idBanco,
      idCiudad: this.data.idCiudad,
      fechaEmision: formattedDateTime,
      posfechado: this.data.posfechado,

      cobro: !this.data.posfechado,
      referencia: this.data.referencia,
      aprobacion: this.data.aprobacion,
      lote: this.data.lote,

      //Data Documento
      nro: this.data.nro,
      valorAbono: Number(this.valorAbono()),
      controlCaja: subEntidadFinanciera?.controlCaja ?? false,
      observacion: this.data.observacion,

      infoCobro: this.data.paymentTypeCode === PaymentTypeCode.EFE ? undefined : JSON.stringify(infoCobro),
      paymentTypeCode: this.data.paymentTypeCode,
      subentidadFinanciera: subEntidadFinanciera?.descripcion,
      secuencial: this.paymentUtil.getUniqueIndex()

    }
  }

  private addDatosCobro(abonoCuota: number) {
    let setObj = {
      ...this.getDataFormaCobro(),
      abonoCuota: roundNumber(abonoCuota, DECIMALS.DOS),
    }
    this.cobrosAgregados.update(e => {
      return [...e, setObj]
    })
  }


  //Calculo de abono y saldo una vez agregado el forma pago
  private calculoTotales() {
    let { totalValorAbono, totalValorAbonoEfectivo } = this.cobrosAgregados().reduce((prev, curr) => {
      prev.totalValorAbono = plus(prev.totalValorAbono, curr.valorAbono, DECIMALS.CINCO)
      if (curr.paymentTypeCode === PaymentTypeCode.EFE) {
        prev.totalValorAbonoEfectivo = plus(prev.totalValorAbonoEfectivo, curr.valorAbono, DECIMALS.CINCO);

      }
      return prev;
    }, {
      totalValorAbono: 0,
      totalValorAbonoEfectivo: 0
    });

    let totalSaldo = this.cuentasPorCobrarCalculado().flatMap(item => item.cuotasCalculadas)
      .reduce((prev, curr) => plus(prev, curr.saldoTotalActual, DECIMALS.CINCO), 0);
    let cambio = 0;

    if (totalValorAbonoEfectivo >= this.dataCuentaPorCobrar().saldo) {
      cambio = minus(totalValorAbonoEfectivo, this.dataCuentaPorCobrar().saldo, DECIMALS.DOS) as number;
    }

    this.dataCuentaPorCobrar.update(e => {
      return {
        ...e,
        abono: roundNumber(totalValorAbono, DECIMALS.DOS),
        cambio
      }
    })

    this.valorAbono.set(totalSaldo.toString());
    this.saldoPendiente.set(totalSaldo)

  }

  opeCobrosAgregadoModal() {
    let modalRef = this.dialogSvc.open(CobrosAgregadoModalComponent, {
      size: 'lg',
      data: this.cobrosAgregados()
    })
    modalRef.subscribe(result => {
      if (result && typeof result === 'object') {

        this.paymentUtil.setCobrosDetalle([]);
        this.paymentUtil.setHistorialCuentas([]);

        let cloneCobrosAgregados = structuredClone(this.cobrosAgregados());
        let index = cloneCobrosAgregados.indexOf(result);
        cloneCobrosAgregados.splice(index, 1);

        this.cobrosAgregados.set(cloneCobrosAgregados)

        //Todas las cuotas en su estado original
        for (let item of this.cuentasPorCobrarCalculado()) {
          item.cuotasCalculadas = structuredClone(item.cuotasCalculadasClone);
        }

        this.paymentUtil.setCuentasPorCobrar(this.cuentasPorCobrarCalculado());


        //Recalculamos las cuotas con los abonos restantes
        let uniqueIndex = 0;
        this.paymentUtil.setUniqueIndex(uniqueIndex);
        for (let item of this.cobrosAgregados()) {
          uniqueIndex++;
          this.paymentUtil.setUniqueIndex(uniqueIndex);

          this.paymentUtil.setValorAbono(item.valorAbono);
       //   this.paymentUtil.setEsAbonoPosfechado(item.posfechado);

          //--------agregando abono ---
          this.paymentUtil.aplicarAbono();
        }

        this.calculoTotales();


      }
    })
  }


  private getDataCobroNormal() {
    let abonoCuota = Number(this.valorAbono()) >= this.dataCuentaPorCobrar().oldSaldo ? this.dataCuentaPorCobrar().oldSaldo : this.valorAbono();
    let comprobante = {
      idCliente: this.dataCuentaPorCobrar().idCliente,
      total: this.valorAbono(),
      abono: abonoCuota,
      codEstab: this.dataCuentaPorCobrar().codEstab,
      observacion: this.data.observacion
    }


    let cobros = [{ ...this.getDataFormaCobro(), abonoCuota }];

    this.paymentUtil.clearData();


    for (let item of this.cuentasPorCobrarCalculado()) {
      item.cuotasCalculadas = structuredClone(item.cuotasCalculadasClone);
    }
    this.paymentUtil.setValorAbono(Number(this.valorAbono()));
    this.paymentUtil.setCuentasPorCobrar(this.cuentasPorCobrarCalculado());
    //this.paymentUtil.setEsAbonoPosfechado(this.data.posfechado);
    this.paymentUtil.setUniqueIndex(0)

    //--------agregando abono ---
    this.paymentUtil.aplicarAbono();

    if (this.paymentUtil.getCobrosDetalle().length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Cobro detalle vacio'
      })
      throw 'Cobro detalle vacio';
    }

    let cobrosDetalle = this.paymentUtil.getCobrosDetalle().filter(item => (item.abono > 0));
    let historialCuentas = this.paymentUtil.getHistorialCuentas();

    let cuentasPorCobrarEstado = this.paymentUtil.generarCuentasPorCobrarEstado({
      historialCuentas,
      cobrosDetalle
    })

    let cuotasPorCobrarEstado = this.paymentUtil.generarCuotasPorCobrarEstado({
      cobrosDetalle
    })

    let data = {
      comprobante,
      cobros,
      cobrosDetalle,
      historialCuentas,
      cuentasPorCobrarEstado,
      cuotasPorCobrarEstado
    }
    return data;
  }


  private getValorAbono(prop: keyof Cobro): number {
    const total = this.cobrosAgregados().reduce((acc, curr) => {
      return plus(acc, curr[prop] as number, DECIMALS.CINCO);
    }, 0);

    return total;
  }


  private getDataCobroMultiple() {
    let totalValorAbono = this.getValorAbono("valorAbono");
    let totalAbonoCuota = this.getValorAbono("abonoCuota");

    let comprobante = {
      idCliente: this.dataCuentaPorCobrar().idCliente,
      total: totalValorAbono,
      abono: totalAbonoCuota,
      codEstab: this.dataCuentaPorCobrar().codEstab,
      observacion: this.data.observacion
    };


    // let cobros = this..map(item => {
    //   let obj = {
    //     idSubEntidadFinanciera: item.idSubEntidadFinanciera,
    //     idEntidadFinanciera: item.idEntidadFinanciera,
    //     idBanco: item.idBanco,
    //     idCuentaBancaria: 0,
    //     fechaEmision: item.fechaEmision,
    //     valor: item.valorAbono,
    //     posfechado: item.posfechado,
    //     cobro: item.cobro,
    //     secuencial: item.secuencial,
    //     infoCobro: item.infoCobro,
    //     abono: item.abonoCuota,
    //     controlCaja: item.controlCaja,
    //     idComprobante: item.idComprobante,
    //     idTipoDocumento: item.idTipoDocumento,
    //     observacion: item.observacion
    //   }
    //   return obj;
    // })
    if (this.paymentUtil.getCobrosDetalle().length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Cobro detalle vacio'
      })
      throw 'Cobro detalle vacio';
    }


    let cobrosDetalle = this.paymentUtil.getCobrosDetalle().filter(item => (item.abono > 0))
    let historialCuentas = this.paymentUtil.getHistorialCuentas();



    let cuentasPorCobrarEstado = this.paymentUtil.generarCuentasPorCobrarEstado({
      historialCuentas,
      cobrosDetalle
    })

    let cuotasPorCobrarEstado = this.paymentUtil.generarCuotasPorCobrarEstado({
      cobrosDetalle
    })

    let data = {
      comprobante,
      cobros: this.cobrosAgregados(),
      cobrosDetalle,
      historialCuentas,
      cuentasPorCobrarEstado,
      cuotasPorCobrarEstado
    }
    return data;
  }


  async save() {
    let params;
    if (this.formaCobro() === 'NORMAL') {
      if (Number(this.valorAbono()) === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Valor a cobrar no tiene que ser un valor 0'
        })
        return
      }
      if (isNaN(Number(this.valorAbono()))) {
        this.tS.toastr({
          type: 'warning',
          message: 'En Valor a Cobrar ingrese un número válido'
        })
        return
      }
      params = this.getDataCobroNormal()
    }

    if (this.formaCobro() === 'MULTIPLE') {
      if (this.cobrosAgregados().length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Agregué al menos un forma de cobro'
        })
        return
      }
      params = this.getDataCobroMultiple();
    }

    if (!isValidField(params)) {
      console.error('error en recuperar los parametros del cobro')
      return
    }


    try {

      let { isConfirmed } = await Swal.fire({
        // title: 'Guardar Cobro?',
        text: "Esta seguro de guardar este cobro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, guardar!',
        cancelButtonText: 'No, cancelar!'
      })

      if (!isConfirmed) return

      this.comprobanteIngresoSvc.post(params).subscribe({
        next: response => {
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
            this.dialogRef.close(response.payload)
          }
        }
      })
    } catch (err) {
      console.error(err)
    }


  }

  closeDialog() {
    this.dialogRef.close()
  }
}
