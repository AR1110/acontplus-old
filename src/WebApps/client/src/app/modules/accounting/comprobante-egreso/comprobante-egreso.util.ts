
import { CuotaPorPagarLista } from "../interfaces/cuota-por-pagar.interface";
import { roundNumber } from "@core/utils/round-number.utils";
import { DECIMALS } from "@core/constants/global.constants";
import { EstadoPago } from "../interfaces/estado-pago.interface";
import { CodigoEstadoPago } from "../enums/codigo-estado-pago.enum";
import { pagoCuotaSinAbonoUtil } from "./pago-cuota-sin-abono.util";
import { pagoCuotaConAbonoUtil } from "./pago-cuota-con-abono.util";
import { CuentaPorPagarCuota, CuentaPorPagarHistorial } from "./comprobante-egreso.interface";
import { minus } from "@core/utils/decimal.util";
import { PagoDetalle } from "../cuenta-por-pagar/interfaces/pago-detalle.interface";

interface ConstructorProps {
  cuentasPorPagar: CuentaPorPagarCuota[]
}
export class ComprobanteEgresoUtil {

  private cuentasPorPagar: CuentaPorPagarCuota[]
  private dataCuentaPorPagarCuota: CuentaPorPagarCuota;
  private pagosDetalle: PagoDetalle[] = [];
  private cuentasPorPagarHistorial: CuentaPorPagarHistorial[] = []
  private estadosPago: EstadoPago[] = []
  private valorAbono: number = 0;
  private esAbonoPosfechado!: boolean;
  private secuencial!: number

  constructor(props: ConstructorProps) {

    this.cuentasPorPagar = props.cuentasPorPagar;
    this.dataCuentaPorPagarCuota = {} as CuentaPorPagarCuota;

  }

  private setValorAbono(value: number) {
    this.valorAbono = value;
  }
  private getValorAbono() {
    return this.valorAbono
  }

  set setEstadosPago(estadosPago: EstadoPago[]) {
    this.estadosPago = estadosPago;
  }

  set setEsAbonoPosfechado(value: boolean) {
    this.esAbonoPosfechado = value;
  }

  private getEsAbonoPosfechado() {
    return this.esAbonoPosfechado;
  }

  set setSecuencial(value: number) {
    this.secuencial = value;
  }

  getSecuencial() {
    return this.secuencial;
  }

  /**
   *
   * @param {*} param0
   * @returns
   */

  generarCuentasPorPagarEstado({ historialCuentas, pagosDetalle }) {
    // Your existing code snippet with modifications for decimal.js
    let cuentasPorPagarAgrupado = historialCuentas.reduce((acc, curr) => {
      let existeDato = acc.find(item => item.idCuentaPorPagar === curr.idCuentaPorPagar);
      if (!existeDato) {
        acc.push({
          idCuentaPorPagar: curr.idCuentaPorPagar,
          valorSaldoLectura: this.fS.instanceDecimal(curr.valorSaldoLectura),
          abono: this.fS.instanceDecimal(curr.abono),
          diasMora: curr.diasMora,
          mora: curr.mora
        });
      } else {
        existeDato.abono = this.fS.plus(existeDato.abono, curr.abono);
      }
      return acc;
    }, []);

    let cuentasPorPagarEstado = [];

    for (let item of cuentasPorPagarAgrupado) {
      let valorSaldo = this.fS.instanceDecimal(item.valorSaldoLectura);


      let totalPosfechado = pagosDetalle.filter(cd => cd.idCuentaPorPagar === item.idCuentaPorPagar && cd.posfechado)
        .reduce((acc, curr) => acc.plus(curr.abono), this.fS.instanceDecimal(0));


      let totalNoPosfechado = pagosDetalle.filter(cd => cd.idCuentaPorPagar === item.idCuentaPorPagar && !cd.posfechado)
        .reduce((acc, curr) => acc.plus(curr.abono), this.fS.instanceDecimal(0));

      valorSaldo = valorSaldo.minus(totalNoPosfechado).toNumber();



      let dataEstadoPago = {};
      if (totalPosfechado.gt(0)) {
        dataEstadoPago = this.getEstadoCuota({
          esPosfechado: true
        });
      } else {
        dataEstadoPago = this.getEstadoCuota({
          saldo: this.fS.roundNumber(valorSaldo, this.fS.max_dos),
          abono: this.fS.roundNumber(totalNoPosfechado.toNumber(), this.fS.max_dos),
        });
      }

      cuentasPorPagarEstado.push({
        idCuentaPorPagar: item.idCuentaPorPagar,
        idEstadoPago: dataEstadoPago.idEstadoPago,
        abono: this.fS.roundNumber(totalNoPosfechado.toNumber(), this.fS.max_dos)
      });
    }

    return cuentasPorPagarEstado;

  }


  /**
   *
   * @param {*} param0
   * @returns
   */
  generarCuotasPorPagarEstado({ pagosDetalle }) {

    let cuotasPorPagarAgrupado = pagosDetalle.reduce((acc, curr) => {
      let existeDato = acc.find(item => (item.idCuentaPorPagar === curr.idCuentaPorPagar) && (item.idCuotaPorPagar === curr.idCuotaPorPagar));
      if (!existeDato) {
        acc.push({
          idCuentaPorPagar: curr.idCuentaPorPagar,
          idCuotaPorPagar: curr.idCuotaPorPagar,
          valorSaldoLectura: curr.valorSaldoLectura,
          abono: this.fS.instanceDecimal(curr.abono)
        });
      } else {
        existeDato.abono = this.fS.plus(existeDato.abono, curr.abono);
      }
      return acc;
    }, []);

    let cuotasPorPagarEstado = [];

    for (let item of cuotasPorPagarAgrupado) {
      let totalNoPosfechado = pagosDetalle.filter(cd => cd.idCuotaPorPagar === item.idCuotaPorPagar && !cd.posfechado)
        .reduce((acc, curr) => {
          return this.fS.plus(acc, curr.abono);
        }, this.fS.instanceDecimal(0));

      let valorSaldoLectura = this.fS.roundNumber(item.valorSaldoLectura, this.fS.max_dos);
      let totalNoPosfechadoTemp = this.fS.roundNumber(totalNoPosfechado.toNumber(), this.fS.max_dos);

      let valorSaldo = this.fS.minus(valorSaldoLectura, totalNoPosfechadoTemp).toNumber();

      let dataEstadoPago = this.getEstadoCuota({
        saldo: valorSaldo,
        abono: item.abono.toNumber() // Convert Decimal back to number if needed
      });

      cuotasPorPagarEstado.push({
        idEstadoPago: dataEstadoPago.idEstadoPago,
        abono: totalNoPosfechado.toNumber(),
        idCuotaPorPagar: item.idCuotaPorPagar
      });
    }

    return cuotasPorPagarEstado;

  }


  agregarCuentasPorPagarHistorial() {
    const pagosDetalleFiltered = this.filtrarPagosDetalle();
    const totalAbonoCuenta = this.calcularTotalAbonoCuenta(pagosDetalleFiltered);

    if (pagosDetalleFiltered.length === 0) {
      this.procesarHistorialSinPagos();
    } else if (!this.esSaldoTotalPagado(totalAbonoCuenta)) {
      this.procesarHistorialConPagos();
    }
  }

  // Filtra los pagos detalle asociados a la cuenta actual
  private filtrarPagosDetalle() {
    return this.pagosDetalle.filter(cd => cd.idCuentaPorPagar === this.dataCuentaPorPagarCuota.idCuentaPorPagar);
  }

  // Calcula el total de abonos para la cuenta actual
  private calcularTotalAbonoCuenta(pagosDetalle: any[]) {
    return pagosDetalle.map(item => item.abono).reduce((acc, curr) => acc + curr, 0);
  }

  // Verifica si el saldo total ya ha sido pagado
  private esSaldoTotalPagado(totalAbonoCuenta: number) {
    return roundNumber(totalAbonoCuenta, DECIMALS.DOS) === roundNumber(this.dataCuentaPorPagarCuota.saldo, DECIMALS.DOS);
  }

  // Procesa el historial cuando no hay pagos previos
  private procesarHistorialSinPagos() {
    const ultimoCobro = this.obtenerUltimoCobro();
    const saldoInicial = this.calcularSaldoInicial(ultimoCobro);

    const abonoHistorial = this.calcularAbonoHistorial(saldoInicial);
    this.agregarRegistroHistorial(saldoInicial, abonoHistorial);
  }

  // Procesa el historial cuando hay pagos previos pero no se ha completado el saldo
  private procesarHistorialConPagos() {
    const ultimoCobro = this.obtenerUltimoCobro();
    const saldoInicial = this.calcularSaldoInicial(ultimoCobro);

    const abonoHistorial = this.calcularAbonoHistorial(saldoInicial);
    this.agregarRegistroHistorial(saldoInicial, abonoHistorial);
  }

  // Obtiene el último cobro registrado en el historial
  private obtenerUltimoCobro() {
    const historialFiltrado = this.cuentasPorPagarHistorial.filter(cd => (
      cd.idCuentaPorPagar === this.dataCuentaPorPagarCuota.idCuentaPorPagar && cd.secuencial === this.secuencial
    ));
    return historialFiltrado.pop();
  }

  // Calcula el saldo inicial a partir del último cobro o el saldo de la cuenta
  private calcularSaldoInicial(ultimoCobro: any) {
    if (ultimoCobro) {
      return minus(ultimoCobro.saldo, ultimoCobro.abono, DECIMALS.GENERAL) as number;
    }
    return roundNumber(this.dataCuentaPorPagarCuota.saldo, DECIMALS.CINCO);
  }

  // Calcula el abono a registrar en el historial
  private calcularAbonoHistorial(saldoInicial: number) {
    if (this.valorAbono <= saldoInicial) {
      return this.valorAbono;
    }
    return saldoInicial;
  }

  // Agrega un nuevo registro al historial de cuentas por pagar
  private agregarRegistroHistorial(saldo: number, abono: number) {
    this.cuentasPorPagarHistorial.push({
      secuencial: this.secuencial,
      idCuentaPorPagar: this.dataCuentaPorPagarCuota.idCuentaPorPagar,
      abono: roundNumber(abono, DECIMALS.CINCO),
      saldo: roundNumber(saldo, DECIMALS.CINCO),
    });
  }


  abonar() {
    for (let group of this.cuentasPorPagar) {

      this.dataCuentaPorPagarCuota = group;

      if (this.valorAbono > 0) {
        this.agregarCuentasPorPagarHistorial();
      }

      for (let dataCuota of group.cuotas) {

        // dataCuota.abonoPosfechado = 0;
        if (this.valorAbono === 0) return;

        //Si la cuota no tiene ningún abono
        if (dataCuota.abono > 0) {

          pagoCuotaConAbonoUtil({
            dataCuota,
            valorAbono: this.getValorAbono(),
            esAbonoPosfechado: this.getEsAbonoPosfechado(),
            agregarPagoDetalle: this.agregarDetalle,
            setValorAbono: this.setValorAbono

          })
        } else {
          pagoCuotaSinAbonoUtil({
            dataCuota,
            valorAbono: this.getValorAbono(),
            esAbonoPosfechado: this.getEsAbonoPosfechado(),
            agregarPagoDetalle: this.agregarDetalle,
            setValorAbono: this.setValorAbono
          })
        }


        this.actualizarEstadoCuota(dataCuota)

      }

    }
  }




  /**
 * Actualiza los valores y el estado de una cuota específica.
 * @param cuota - La cuota a actualizar.
 */
  private actualizarEstadoCuota(cuota: CuotaPorPagarLista): void {
    cuota.cuota = roundNumber(cuota.cuota, DECIMALS.CINCO);
    cuota.abono = roundNumber(cuota.abono, DECIMALS.CINCO);
    //cuota.abonoPosfechado = roundNumber(cuota.abonoPosfechado, this.DECIMAL_CINCO);

    const { nombreEstado } = this.determinarEstadoCuota({
      saldo: cuota.saldo,
      abono: cuota.abono
    });
    cuota.nombreEstado = nombreEstado;
    cuota.esCuotaAbonado = true; // Marcar la cuota como afectada.
  }

  private determinarEstadoCuota({ saldo, abono, esPosfechado }: { saldo: number; abono: number; esPosfechado?: boolean }) {

    let estadoKey: CodigoEstadoPago;
    let nombreEstado;

    if (esPosfechado) {
      estadoKey = CodigoEstadoPago.POSFECHADO;
      nombreEstado = 'POSFECHADO'
    } else if (saldo === 0) {
      estadoKey = CodigoEstadoPago.PAGADA;
      nombreEstado = 'PAGADA'

    } else if (saldo > 0 && abono > 0) {
      estadoKey = CodigoEstadoPago.PENDIENTE_PARCIAL;
      nombreEstado = 'PENDIENTE PARCIAL'

    } else {
      estadoKey = CodigoEstadoPago.PENDIENTE;
      nombreEstado = 'PENDIENTE'

    }
    const estadoPago = this.estadosPago.find(ep => ep.codigo === estadoKey) || { idEstadoPago: null, descripcion: '' };

    return {
      idEstadoPago: estadoPago.idEstadoPago,
      nombreEstado,
    };
  }



  agregarDetalle(dataCuota: CuotaPorPagarLista, abono: number, saldo: number) {

    if (dataCuota.cuota === 0 || abono === 0) return;

    let valorMovimientoSaldo = 0;
    let pagosDetalleFiltered = this.pagosDetalle.filter(cd => (
      cd.idCuentaPorPagar === this.dataCuentaPorPagarCuota.idCuentaPorPagar &&
      cd.idCuotaPorPagar === dataCuota.idCuotaPorPagar
    ))

    let dataUltimoCobroDetalle = pagosDetalleFiltered.pop();
    if (dataUltimoCobroDetalle) {
      valorMovimientoSaldo = minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono, DECIMALS.CINCO) as number
    } else {
      valorMovimientoSaldo = roundNumber(dataCuota.saldo, DECIMALS.CINCO);
    }

    this.pagosDetalle.push({
      idCuentaPorPagar: this.dataCuentaPorPagarCuota.idCuentaPorPagar,
      idCuotaPorPagar: dataCuota.idCuotaPorPagar,
      abono,
      // interes: item.interes,
      //  diasMora: item.diasMora,
      //  mora: item.mora,
      cuota: roundNumber(dataCuota.cuota, DECIMALS.CINCO),
      saldo: roundNumber(saldo, DECIMALS.CINCO),
      secuencial: this.secuencial,
      saldoMovimiento: roundNumber(valorMovimientoSaldo, DECIMALS.CINCO)
      // valorSaldoLectura: item.valorSaldoLectura,

      //  saldoOriginal: this.fS.instanceDecimal(valorMovimientoSaldo, DECIMALS.CINCO),
      //  posfechado: this.esAbonoPosfechado
    })
    // item.saldo = this.fS.instanceDecimal(item.saldo, DECIMALS.CINCO);

    // item.saldoOriginal = this.fS.minus(item.saldoOriginal, abono, DECIMALS.CINCO);

  }


}
