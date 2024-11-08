import { DECIMALS, PaymentTypeCode } from "@/shared/enums/main.enum";
import { CobroDetalle, CuentaPorCobrar, CuentaPorCobrarCalculado, CuotaCobroCalculado, HistorialCuenta } from "@/shared/models/contabilidad/payment.model";
import { ToasterService } from "@/shared/services/toaster.service";

import { minus, plus } from "./decimal.util";
import { roundNumber } from "./round-number.util";
import { getValidId, isValidField } from "./utils";
import { isDateValid } from "./date.util";

export class PaymentUtil {
  #cuentasPorCobrar: CuentaPorCobrarCalculado[] = [];
  #valorAbono = 0;
  #dataCuentaPorCobrar = {} as CuentaPorCobrarCalculado;
  #esAbonoPosfechado = false;
  #cobrosDetalle: CobroDetalle[] = [];
  #uniqueIndex = 0;
  #historialCuentas: HistorialCuenta[] = [];
  #estadosCobro: any[] = [];

  #configCobro = {};

  constructor(public tS: ToasterService) {

  }

  // constructor() {
  //   this.#cuentasPorCobrar = [];
  //   this._valorAbono = 0;
  //   this._dataCuentaPorCobrar = {};
  //   this._esAbonoPosfechado = false;
  //   this._cobrosDetalle = [];
  //   this._uniqueIndex = 0;
  //   this._historialCuentas = [];
  //   this._estadosCobro = [];

  //   this._configCobro = {};

  //   this.MAX_DECIMALS = {
  //     GENERAL: 3,
  //     CUOTA_ABONO: 5,
  //     DEFAULT: 5
  //   };
  // }

  getCuentasPorCobrar() {
    return this.#cuentasPorCobrar;
  }

  setCuentasPorCobrar(values: CuentaPorCobrarCalculado[]) {
    this.#cuentasPorCobrar = values;
  }

  setValorAbono(value: number) {
    this.#valorAbono = value;
  }

  getValorAbono() {
    return this.#valorAbono;
  }

  getUniqueIndex() {
    return this.#uniqueIndex;
  }
  setUniqueIndex(index: number) {
    this.#uniqueIndex = index;
  }

  setCobrosDetalle(values: any[]) {
    this.#cobrosDetalle = values;
  }

  getCobrosDetalle() {
    return this.#cobrosDetalle;
  }

  setHistorialCuentas(values: any) {
    this.#historialCuentas = values;
  }

  getHistorialCuentas() {
    return this.#historialCuentas;
  }

  getEstadoCobro() {
    return this.#estadosCobro;
  }

  setEstadoCobro(values: any) {
    this.#estadosCobro = values;
  }

  setConfigCobro(value: any) {
    this.#configCobro = value;
  }

  getConfigCobro() {
    return this.#configCobro
  }

  setEsAbonoPosfechado(value: any) {
    this.#esAbonoPosfechado = value;
  }

  getEsAbonoPosfechado() {
    return this.#esAbonoPosfechado;
  }


  obtenerDiferenciaDias(fechaVencimiento: string) {
    const hoy = new Date();
    const formatearFechaVcto = new Date(fechaVencimiento);
    const diasMora = Math.floor((hoy.getTime() - formatearFechaVcto.getTime()) / (1000 * 60 * 60 * 24)); // Diferencia en días
    return diasMora;
  }

  calcularInteresMora(documentosCuotas: CuentaPorCobrar[]): CuentaPorCobrarCalculado[] {
    let resultados = documentosCuotas.map(x => {
      let { cuotas, cuotasClone, ...documento } = x;

      let cuotasCalculadas: CuotaCobroCalculado[] = cuotas.map((cuota) => {

        // Inicialización de variables
        let interesPorMoraActual = 0;
        let diasMoraActual = 0;
        let interesActual = 0;
        let saldoTotalActual = cuota.saldo;


        // Calcular interés y mora si hay días de mora
        // if (documento.tipo && this._configCobro.configDeuda && this._configCobro.tipoConfig === "PI") {
        //   // Calcular días de mora
        //   diasMoraActual = this.obtenerDiferenciaDias(cuota.fechaVencimiento);

        //   if (diasMoraActual > 0) {

        //     interesActual = fS.div(fS.mul(cuota.saldo, this._configCobro.interes, 5), 100, 5);
        //     interesPorMoraActual = fS.mul(interesActual, diasMoraActual, 5);
        //     saldoTotalActual = fS.plus(saldoTotalActual, interesPorMoraActual, 5)

        //   } else {
        //     diasMoraActual = 0;
        //   }
        // }

        let resultCuentaPorCobrar: CuotaCobroCalculado = {
          idCuotaPorCobrar: cuota.idCuotaPorCobrar,
          idCuentaPorCobrar: cuota.idCuentaPorCobrar,
          fechaVencimiento: cuota.fechaVencimiento,
          nroCuota: cuota.nroCuota,
          cuota: cuota.cuota,
          mora: cuota.mora,
          interes: cuota.interes,
          diasMora: cuota.diasMora,
          diasMoraActual: diasMoraActual,
          interesPorMoraActual: interesPorMoraActual,
          interesActual: interesActual,
          abono: cuota.abono,
          saldo: cuota.saldo,
          estado: cuota.estado,
          abonoPosfechado: 0,
          esCuotaAfectada: false,
          saldoTotalActual: roundNumber(saldoTotalActual, DECIMALS.CINCO),
          saldoTotalOriginal: roundNumber(saldoTotalActual, DECIMALS.CINCO),
          saldoTotalLectura: roundNumber(saldoTotalActual, DECIMALS.CINCO)
        }
        return resultCuentaPorCobrar;
      });

      // let saldoActualDoc = 0;
      // let diasMoraActual = 0;
      // let interesPorMoraActual = fS.instanceDecimal(0);
      // let interesActual = fS.instanceDecimal(0);
      // for (let cc of cuotasCalculadas) {
      //   saldoActualDoc = fS.plus(saldoActualDoc, cc.saldoTotalActual, 5);
      //   diasMoraActual += cc.diasMoraActual;
      //   interesPorMoraActual = interesPorMoraActual.plus(cc.interesPorMoraActual);
      //   interesActual = interesActual.plus(cc.interesActual)
      // }


      return {
        ...documento,
        saldoActualDoc: roundNumber(x.saldo, DECIMALS.DOS),
        cuotasCalculadas: structuredClone(cuotasCalculadas),
        cuotasCalculadasClone: structuredClone(cuotasCalculadas),
        diasMoraActual: 0,
        interesPorMoraActual: 0,
        interesActual: 0

      };
    });

    return resultados;
  }


  isValidForm(data: any, codigoEntidad: any) {
    if (!getValidId(data.idSubEntidadFinanciera)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione la SubEntidad Financiera'
      })
      return
    }

    if (!isValidField(data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese la fecha de emisión'
      })
      return
    }
    if (!isDateValid(data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese una fecha válida'
      })
      return
    }

    if (!getValidId(data.valorAbono)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese el valor de abono'
      })
      return
    }

    // =================== TRANSFERENCIAS  =================================== //

    if (codigoEntidad === PaymentTypeCode.TRA) {
      if (!getValidId(data.idBanco)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese el Banco'
        })
        return
      }
      if (!isValidField(data.nro)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese el Número'
        })
        return
      }
    }

    // =================== CHEQUES  =================================== //

    if (codigoEntidad === PaymentTypeCode.CHE) {
      if (!getValidId(data.idBanco)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese el Banco'
        })
        return
      }
      if (!isValidField(data.nro)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese el Número'
        })
        return
      }

      if (!getValidId(data.idCiudad)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la Ciudad'
        })
        return
      }
      if (!isValidField(data.referencia)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese a quien va dirigido el Cheque'
        })
        return
      }
    }

    return true;
  }

  aplicarAbono() {

    for (let group of this.getCuentasPorCobrar()) {
      this.#dataCuentaPorCobrar = group;
      this.processGroup();
      this.processCuota()
    }

  }

  //INICIO FUNCIONES DATOS CUENTAS POR COBRAR
  processGroup() {
    if (typeof this.getValorAbono() !== 'number' || this.getValorAbono() > 0) {
      //let valorMovimientoSaldo = 0, historialAbono = 0;
      let valorMovimientoSaldo = 0, historialAbono = 0;

      const cobrosDetalleFiltered = this.getCobrosDetalle().filter(cd => cd.idCuentaPorCobrar === this.#dataCuentaPorCobrar.idCuentaPorCobrar)

      const totalAbonoCuenta = cobrosDetalleFiltered.reduce((acc, curr) => {
        acc = plus<number>(acc, curr.abono, DECIMALS.CINCO);
        return acc;
      }, 0);

      if (cobrosDetalleFiltered.length === 0) {

        let historialCuentasFiltered = this.getHistorialCuentas().filter(cd => (
          cd.idCuentaPorCobrar === this.#dataCuentaPorCobrar.idCuentaPorCobrar && cd.secuencial === this.getUniqueIndex()
        ));

        let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

        if (dataUltimoCobroDetalle) {

          valorMovimientoSaldo = plus<any>(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono).toNumber();
        } else {
          valorMovimientoSaldo = this.#dataCuentaPorCobrar.saldoActualDoc;
        }

        if (this.getValorAbono() <= this.#dataCuentaPorCobrar.saldoActualDoc) {
          historialAbono = this.getValorAbono();

        } else if (this.getValorAbono() >= this.#dataCuentaPorCobrar.saldoActualDoc) {
          historialAbono = this.#dataCuentaPorCobrar.saldoActualDoc
        }

        this.addHistorialCuenta(valorMovimientoSaldo, historialAbono)

      }
      if (cobrosDetalleFiltered.length > 0) {
        if (totalAbonoCuenta !== roundNumber(this.#dataCuentaPorCobrar.saldoActualDoc, DECIMALS.DOS)) {

          let historialCuentasFiltered = this.getHistorialCuentas().filter(cd => (
            cd.idCuentaPorCobrar === this.#dataCuentaPorCobrar.idCuentaPorCobrar
          ));

          let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

          if (dataUltimoCobroDetalle) {

            valorMovimientoSaldo = minus<any>(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono).toNumber() as number

          } else {
            valorMovimientoSaldo = this.#dataCuentaPorCobrar.saldoActualDoc
          }

          if (this.getAbonoCuota() <= valorMovimientoSaldo) {
            historialAbono = this.getValorAbono();

          } else {
            historialAbono = valorMovimientoSaldo
          }


          this.addHistorialCuenta(valorMovimientoSaldo, historialAbono)
        }
      }

    }

  }


  calculateTotalAbonoCuenta(idCuentaPorCobrar: number) {
    return this.getCobrosDetalle()
      .filter(cd => cd.idCuentaPorCobrar === idCuentaPorCobrar)
      .reduce((acc, curr) => {
        acc = plus<any>(acc, curr.abono).toNumber()
        return acc;
      }, 0);
  }

  getLastCobroDetalle(groupId: number, uniqueIndex: number) {
    return this.getHistorialCuentas()
      .filter(cd => cd.idCuentaPorCobrar === groupId && cd.secuencial === uniqueIndex)
      .pop();
  }

  calculateValorMovimientoSaldo(dataUltimoCobroDetalle: CobroDetalle | null, groupSaldo: number) {
    return dataUltimoCobroDetalle
      ? minus<number>(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono, DECIMALS.CINCO) as number
      : groupSaldo
  }

  calculateHistorialAbono(groupSaldo: number, valorMovimientoSaldo: number) {
    return Math.min(this.getValorAbono(), groupSaldo, valorMovimientoSaldo);
  }

  addHistorialCuenta(valorMovimientoSaldo: number, historialAbono: number) {
    this.getHistorialCuentas().push({
      secuencial: this.getUniqueIndex(),
      valorSaldoLectura: this.#dataCuentaPorCobrar.saldoActualDoc,
      idCuentaPorCobrar: this.#dataCuentaPorCobrar.idCuentaPorCobrar,
      abono: roundNumber(historialAbono, DECIMALS.DOS),
      saldo: roundNumber(valorMovimientoSaldo, DECIMALS.DOS),
      diasMoraActual: this.#dataCuentaPorCobrar.diasMoraActual,
      interesPorMoraActual: this.#dataCuentaPorCobrar.interesPorMoraActual,
      interesActual: this.#dataCuentaPorCobrar.interesActual
    });
  }

  //FIN FUNCIONES DATOS CUENTAS POR COBRAR


  //INICIO FUNCIONES DATOS CUOTAS
  processCuota() {
    for (let dataCuota of this.#dataCuentaPorCobrar.cuotasCalculadas) {

      dataCuota.abonoPosfechado = 0;

      if (typeof this.getValorAbono() !== 'number' || this.getValorAbono() === 0) return;

      if (dataCuota.abono > 0) {
        this.cuotaConAbono(dataCuota);
      } else {
        this.cuotaSinAbono(dataCuota);
      }

      this.roundCuotaFields(dataCuota);
      this.updateEstado(dataCuota);

      dataCuota.esCuotaAfectada = true;


    }
  }


  //INICIO FUNCIONES DE LA CUOTAS CON ABONOS

  /**
   *
   * @param {*} item
   */
  cuotaConAbono(item: CuotaCobroCalculado) {
    if (item.saldoTotalActual >= this.getValorAbono()) {
      this.handleFullAbonoWithExistingAbono(item);
    } else {
      this.handlePartialAbonoWithExistingAbono(item);
    }
  }

  /**
   *
   * @param {*} dataCuota
   */
  handleFullAbonoWithExistingAbono(dataCuota: CuotaCobroCalculado) {

    // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
    if (this.getEsAbonoPosfechado()) {
      dataCuota.abonoPosfechado = plus(dataCuota.abonoPosfechado, this.getValorAbono(), DECIMALS.CINCO);
    } else {
      let totalAbonoCuota = plus<number>(dataCuota.abono, this.getValorAbono(), DECIMALS.CINCO);

      if (roundNumber(totalAbonoCuota, DECIMALS.DOS) === roundNumber(dataCuota.saldo, DECIMALS.DOS)) {
        dataCuota.abono = dataCuota.saldo;
      } else {
        dataCuota.abono = totalAbonoCuota;
      }

    }

    // Resta el valor del abono al saldo total actual de la cuota
    let saldoTotalActual = minus(dataCuota.saldoTotalActual, this.getValorAbono(), DECIMALS.CINCO) as number;

    //se verifica antes  por temas de decimales porque al final queda milesimas
    if (roundNumber(saldoTotalActual, DECIMALS.DOS) === 0) {
      dataCuota.saldoTotalActual = 0;
    } else {
      dataCuota.saldoTotalActual = saldoTotalActual;
    }


    // Agrega un detalle de cobro con el valor del abono y el saldo total actual
    this.addCobroDetalle(dataCuota, this.getValorAbono(), dataCuota.saldoTotalActual);

    // Resetea el valor del abono a 0
    this.setValorAbono(0);
  }


  /**
   * Maneja un abono parcial con un abono existente.
   *
   * @param {*} dataCuota - El objeto que contiene información del abono y el saldoTotalActual.
   */
  handlePartialAbonoWithExistingAbono(dataCuota: CuotaCobroCalculado) {
    // Determina si el abono es posfechado y ajusta el valor del abono según corresponda
    if (this.getEsAbonoPosfechado()) {
      dataCuota.abonoPosfechado = plus(dataCuota.abonoPosfechado, dataCuota.saldoTotalActual, DECIMALS.CINCO);
    } else {
      dataCuota.abono = plus(dataCuota.abono, dataCuota.saldoTotalActual, DECIMALS.CINCO);
    }

    // Agrega un detalle de cobro con el saldoTotalActual como valor del abono
    this.addCobroDetalle(dataCuota, dataCuota.saldoTotalActual, 0);

    // Calcula el nuevo valor del abono restando el saldo del valor actual del abono
    let valorAbono = minus(this.getValorAbono(), dataCuota.saldoTotalActual, DECIMALS.CINCO) as number;
    this.setValorAbono(valorAbono);

    // Establece el saldo del dataCuota a 0
    dataCuota.saldoTotalActual = 0;
  }


  //FIN FUNCIONES DE LA CUOTAS CON ABONOS


  //INICIO FUNCIONES DE LA CUOTAS SIN ABONOS
  /**
   *
   * @param {*} dataCuota
   */
  cuotaSinAbono(dataCuota: CuotaCobroCalculado) {

    if (dataCuota.saldoTotalActual >= this.getValorAbono()) {
      this.handleFullAbono(dataCuota);
    } else {
      this.handlePartialAbono(dataCuota);
    }
  }

  /**
   *
   * @param {*} dataCuota
   */
  handleFullAbono(dataCuota: CuotaCobroCalculado) {
    dataCuota.abono = this.getEsAbonoPosfechado() ? 0 : this.getValorAbono();
    dataCuota.abonoPosfechado = this.getEsAbonoPosfechado() ? this.getValorAbono() : 0;
    dataCuota.saldoTotalActual = minus(dataCuota.saldoTotalActual, this.getValorAbono(), DECIMALS.CINCO) as number;
    this.addCobroDetalle(dataCuota, this.getValorAbono(), dataCuota.saldoTotalActual);
    this.setValorAbono(0)
  }

  /**
   *
   * @param {*} dataCuota
   */
  handlePartialAbono(dataCuota: CuotaCobroCalculado) {
    dataCuota.abono = this.getEsAbonoPosfechado() ? 0 : roundNumber(dataCuota.saldoTotalActual, DECIMALS.CINCO);

    dataCuota.abonoPosfechado = this.getEsAbonoPosfechado() ? roundNumber(dataCuota.saldoTotalActual, DECIMALS.CINCO) : 0;

    let valorAbono = minus(this.getValorAbono(), dataCuota.saldoTotalActual, DECIMALS.CINCO) as number;
    console.log(valorAbono)
    //verificamos si la resta de valor abono es igual al total a cobrar
    //tomar mucha en cuenta, se agrega por temas de decimales
    if (roundNumber(valorAbono, DECIMALS.DOS) === roundNumber(dataCuota.saldoTotalActual, DECIMALS.DOS)) {
      valorAbono = dataCuota.saldoTotalActual;
    }


    this.setValorAbono(valorAbono);

    this.addCobroDetalle(dataCuota, dataCuota.saldoTotalActual, 0);
    dataCuota.saldoTotalActual = 0;
  }

  //FIN FUNCIONES DE LA CUOTAS SIN ABONOS


  //FUNCIONES COBRO DETALLE
  /**
 *
 * @param {*} dataCuota
 * @param {*} abono
 * @param {*} saldo
 * @returns
 */

  addCobroDetalle(dataCuota: CuotaCobroCalculado, abono: number, saldo: number) {
    if (dataCuota.cuota === 0 || abono === 0) return;

    let valorMovimientoSaldo = this.calculateValorMovimientoSaldoCuota(dataCuota);

    this.getCobrosDetalle().push({
      idCuentaPorCobrar: this.#dataCuentaPorCobrar.idCuentaPorCobrar,
      idCuotaPorCobrar: dataCuota.idCuotaPorCobrar,
      abono,

      diasMoraActual: dataCuota.diasMoraActual,
      interesPorMoraActual: dataCuota.interesPorMoraActual,
      interesActual: dataCuota.interesActual,


      cuota: roundNumber(dataCuota.cuota, DECIMALS.CINCO),
      saldo: roundNumber(saldo, DECIMALS.CINCO),
      secuencial: this.getUniqueIndex(),
      valorSaldoLectura: dataCuota.saldoTotalLectura,
      saldoOriginal: roundNumber(valorMovimientoSaldo, DECIMALS.CINCO),
      posfechado: this.getEsAbonoPosfechado()
    });

    dataCuota.saldoTotalActual = roundNumber(dataCuota.saldoTotalActual, DECIMALS.CINCO);
    dataCuota.saldoTotalOriginal = minus(dataCuota.saldoTotalOriginal, abono, DECIMALS.CINCO) as number;
  }

  /**
   *
   * @param {*} dataCuota
   * @returns
   */
  calculateValorMovimientoSaldoCuota(dataCuota: CuotaCobroCalculado) {
    let cobrosDetalleFiltered = this.getCobrosDetalle().filter(cd => (
      cd.idCuentaPorCobrar === this.#dataCuentaPorCobrar.idCuentaPorCobrar &&
      cd.idCuotaPorCobrar === dataCuota.idCuotaPorCobrar
    ));

    let dataUltimoCobroDetalle = cobrosDetalleFiltered.pop();
    return dataUltimoCobroDetalle
      ? minus(dataUltimoCobroDetalle.saldoOriginal, dataUltimoCobroDetalle.abono, DECIMALS.CINCO) as number
      : roundNumber(dataCuota.saldoTotalOriginal, DECIMALS.CINCO)
  }



  roundCuotaFields(dataCuota: CuotaCobroCalculado) {
    dataCuota.cuota = dataCuota.cuota
    dataCuota.abono = dataCuota.abono
    dataCuota.abonoPosfechado = dataCuota.abonoPosfechado;
  }

  updateEstado(dataCuota: CuotaCobroCalculado) {
    let dataEstadoPago = this.getEstadoCuota({
      saldo: dataCuota.saldoTotalActual,
      abono: dataCuota.abono,
      esPosfechado: false
    });
    dataCuota.estado = dataEstadoPago.descripcion;
  }


  /**
   *
   * @param {*} param0
   * @returns
   */


  getEstadoCuota<T extends { saldo: number, abono: number, esPosfechado: boolean }>({ saldo, abono, esPosfechado }: T) {
    let estado = '';
    let dataEstadoPago: any = {};

    if (esPosfechado) {
      dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'PFC');
    } else {
      if (saldo === 0) {
        dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'CBR');
        estado = 'COBRADA'
      }
      if (saldo > 0) {
        dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'PP');
        estado = "PENDIENTE PARCIAL";
      }
      if (abono === 0) {
        dataEstadoPago = this.getEstadoCobro().find(ep => ep.codigo === 'PE');
        estado = "PENDIENTE";
      }

    }


    return {
      idEstadoPago: dataEstadoPago.idEstadoPago,
      descripcion: estado
    }
  }



  getAbonoCuota() {
    let abonoCuota = this.getCobrosDetalle()
      .filter(item => item.secuencial === this.getUniqueIndex())
      .reduce((prev, curr) => {
        prev = plus(prev, curr.abono, DECIMALS.CINCO)
        return prev;
      }, 0)

    return abonoCuota;

  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  generarCuentasPorCobrarEstado<T extends { historialCuentas: HistorialCuenta[], cobrosDetalle: CobroDetalle[] }>({ historialCuentas, cobrosDetalle }: T) {

    let cuentasPorCobrarAgrupado = historialCuentas.reduce((acc, curr) => {
      let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar);
      if (!existeDato) {
        acc.push({
          ...curr,
        });
      } else {
        existeDato.abono = plus(existeDato.abono, curr.abono, DECIMALS.CINCO) as number
      }
      return acc;
    }, [] as HistorialCuenta[]);

    let cuentasPorCobrarEstado = [];

    for (let item of cuentasPorCobrarAgrupado) {
      let totalPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && cd.posfechado)
        .reduce((acc, curr) => {
          acc = plus(acc, curr.abono, DECIMALS.CINCO) as number
          return acc;
        }, 0);

      let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && !cd.posfechado)
        .reduce((acc, curr) => {
          acc = plus(acc, curr.abono, DECIMALS.CINCO) as number
          return acc;

        }, 0);


      let valorSaldo = minus(item.valorSaldoLectura, totalNoPosfechado, DECIMALS.CINCO) as number;


      let dataEstadoPago;
      if (totalPosfechado > 0) {
        dataEstadoPago = this.getEstadoCuota({
          esPosfechado: true,
          saldo: 0,
          abono: 0
        });
      } else {
        dataEstadoPago = this.getEstadoCuota({
          saldo: roundNumber(valorSaldo, DECIMALS.DOS),
          abono: roundNumber(totalNoPosfechado, DECIMALS.DOS),
          esPosfechado: false
        });
      }

      cuentasPorCobrarEstado.push({
        ...item,
        idEstadoPago: dataEstadoPago.idEstadoPago,
        abono: roundNumber(totalNoPosfechado, DECIMALS.DOS)
      });
    }

    return cuentasPorCobrarEstado;

  }



  generarCuotasPorCobrarEstado<T extends { cobrosDetalle: CobroDetalle[] }>({ cobrosDetalle }: T) {

    let cuotasPorCobrarAgrupado = cobrosDetalle.reduce((acc, curr) => {
      let existeDato = acc.find(dataCxc => (dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar) && (dataCxc.idCuotaPorCobrar === curr.idCuotaPorCobrar));
      if (!existeDato) {
        acc.push({
          ...curr,
        });
      } else {
        existeDato.abono = plus(existeDato.abono, curr.abono, DECIMALS.CINCO);
      }
      return acc;
    }, [] as CobroDetalle[]);

    let cuotasPorCobrarEstado = [];

    for (let item of cuotasPorCobrarAgrupado) {
      let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuotaPorCobrar === item.idCuotaPorCobrar && !cd.posfechado)
        .reduce((acc, curr) => {
          return plus(acc, curr.abono, DECIMALS.CINCO)
        }, 0);

      let valorSaldoLectura = roundNumber(item.valorSaldoLectura, DECIMALS.DOS);
      let totalNoPosfechadoRounded = roundNumber(totalNoPosfechado, DECIMALS.DOS);
      let valorSaldo = minus(valorSaldoLectura, totalNoPosfechadoRounded, DECIMALS.DOS) as number


      let dataEstadoPago = this.getEstadoCuota({
        saldo: roundNumber(valorSaldo, 2),
        abono: roundNumber(valorSaldo, 2),
        esPosfechado: false,
      });

      cuotasPorCobrarEstado.push({
        ...item,
        idEstadoPago: dataEstadoPago.idEstadoPago,
        abono: totalNoPosfechado,
      });
    }

    return cuotasPorCobrarEstado;

  }


  clearData() {

    this.setCuentasPorCobrar([])
    this.setValorAbono(0)
    this.setUniqueIndex(0)
    this.setCobrosDetalle([]);
    this.setHistorialCuentas([]);
    this.setEsAbonoPosfechado(false);
  }


}
