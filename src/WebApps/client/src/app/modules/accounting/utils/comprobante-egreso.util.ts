import { roundNumber } from '@core/utils/round-number.utils';
import { DECIMALS } from '@core/constants/global.constants';
import { pagoCuotaSinAbonoUtil } from './pago-cuota-sin-abono.util';
import { pagoCuotaConAbonoUtil } from './pago-cuota-con-abono.util';

import { minus } from '@core/utils/decimal.util';
import {
  CuentaPorPagarCuota,
  CuentaPorPagarHistorial,
} from '@accounting/data/models/comprobante-egreso.entity';
import { PagoDetalle } from '@accounting/data/models/pago-detalle.model';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';
import { CuotaPorPagarLista } from '@accounting/data/models/cuota-por-pagar.interface';
import { determinadoEstadoPagoCuotaUtil } from './determinado-estado-pago-cuota.util';

export class ComprobanteEgresoUtil {
  private cuentasPorPagar: CuentaPorPagarCuota[];
  private dataCuentaPorPagarCuota: CuentaPorPagarCuota;
  private pagosDetalle: PagoDetalle[];
  private cuentasPorPagarHistorial: CuentaPorPagarHistorial[];
  private estadosPago: EstadoPago[] = [];
  private valorAbono = 0;
  private esAbonoPosfechado!: boolean;
  private secuencial!: number;

  constructor(cuentasPorPagar: CuentaPorPagarCuota[]) {
    this.cuentasPorPagar = structuredClone(cuentasPorPagar);
    this.dataCuentaPorPagarCuota = {} as CuentaPorPagarCuota;
    this.pagosDetalle = [];
    this.cuentasPorPagarHistorial = [];
  }

  //secuencial
  setSecuencial(value: number) {
    this.secuencial = value;
  }

  getSecuencial() {
    return this.secuencial;
  }

  //valor abono
  setValorAbono = (value: number) => {
    this.valorAbono = value;
  };

  getValorAbono() {
    return this.valorAbono;
  }

  setEstadosPago(estadosPago: EstadoPago[]) {
    this.estadosPago = estadosPago;
  }

  setEsAbonoPosfechado(value: boolean) {
    this.esAbonoPosfechado = value;
  }
  getEsAbonoPosfechado() {
    return this.esAbonoPosfechado;
  }

  setPagosDetalle(pagosDetalle: PagoDetalle[]) {
    this.pagosDetalle = pagosDetalle;
  }

  getPagosDetalle() {
    return this.pagosDetalle;
  }

  getCuentasPorPagar() {
    return this.cuentasPorPagar;
  }

  setCuentasPorPagarHistorial(values: CuentaPorPagarHistorial[]) {
    this.cuentasPorPagarHistorial = values;
  }
  getCuentasPorPagarHistorial() {
    return this.cuentasPorPagarHistorial;
  }

  abonar() {
    if (!Array.isArray(this.estadosPago) || this.estadosPago.length === 0) {
      throw new Error('Estado pago no válido');
    }

    for (const group of this.cuentasPorPagar) {
      this.dataCuentaPorPagarCuota = group;

      if (this.valorAbono > 0) {
        this.agregarCuentasPorPagarHistorial();
      }

      for (const dataCuota of group.cuotas) {
        // dataCuota.abonoPosfechado = 0;
        if (this.valorAbono === 0) return;

        //Si la cuota no tiene ningún abono
        if (dataCuota.abono > 0) {
          pagoCuotaConAbonoUtil({
            dataCuota,
            valorAbono: this.getValorAbono(),
            esAbonoPosfechado: this.getEsAbonoPosfechado(),
            agregarPagoDetalle: this.agregarPagoDetalle,
            setValorAbono: this.setValorAbono,
          });
        } else {
          pagoCuotaSinAbonoUtil({
            dataCuota,
            valorAbono: this.getValorAbono(),
            esAbonoPosfechado: this.getEsAbonoPosfechado(),
            agregarPagoDetalle: this.agregarPagoDetalle,
            setValorAbono: this.setValorAbono,
          });
        }

        this.actualizarEstadoCuota(dataCuota);
      }
    }
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
    return this.pagosDetalle.filter(
      (cd) => cd.idCuentaPorPagar === this.dataCuentaPorPagarCuota.idCuentaPorPagar,
    );
  }

  // Calcula el total de abonos para la cuenta actual
  private calcularTotalAbonoCuenta(pagosDetalle: any[]) {
    return pagosDetalle.map((item) => item.abono).reduce((acc, curr) => acc + curr, 0);
  }

  // Verifica si el saldo total ya ha sido pagado
  private esSaldoTotalPagado(totalAbonoCuenta: number) {
    return (
      roundNumber(totalAbonoCuenta, DECIMALS.DOS) ===
      roundNumber(this.dataCuentaPorPagarCuota.saldo, DECIMALS.DOS)
    );
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
    const historialFiltrado = this.cuentasPorPagarHistorial.filter(
      (cd) =>
        cd.idCuentaPorPagar === this.dataCuentaPorPagarCuota.idCuentaPorPagar &&
        cd.secuencial === this.secuencial,
    );
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

  /**
   * Actualiza los valores y el estado de una cuota específica.
   * @param cuota - La cuota a actualizar.
   */
  private actualizarEstadoCuota(cuota: CuotaPorPagarLista): void {
    cuota.cuota = roundNumber(cuota.cuota, DECIMALS.CINCO);
    cuota.abono = roundNumber(cuota.abono, DECIMALS.CINCO);
    //cuota.abonoPosfechado = roundNumber(cuota.abonoPosfechado, this.DECIMAL_CINCO);

    const { descripcion } = determinadoEstadoPagoCuotaUtil({
      saldo: cuota.saldo,
      abono: cuota.abono,
      estadosPago: this.estadosPago,
      esPosfechado: this.getEsAbonoPosfechado(),
    });
    cuota.nombreEstado = descripcion;
    cuota.esCuotaAbonado = true; // Marcar la cuota como afectada.
  }

  agregarPagoDetalle = (dataCuota: CuotaPorPagarLista, abono: number, saldo: number) => {
    if (dataCuota.cuota === 0 || abono === 0) return;

    let valorMovimientoSaldo = 0;
    const pagosDetalleFiltered = this.pagosDetalle.filter(
      (cd) =>
        cd.idCuentaPorPagar === this.dataCuentaPorPagarCuota.idCuentaPorPagar &&
        cd.idCuotaPorPagar === dataCuota.idCuotaPorPagar,
    );

    const dataUltimoCobroDetalle = pagosDetalleFiltered.pop();
    if (dataUltimoCobroDetalle) {
      valorMovimientoSaldo = minus(
        dataUltimoCobroDetalle.saldo,
        dataUltimoCobroDetalle.abono,
        DECIMALS.CINCO,
      ) as number;
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
      saldoMovimiento: roundNumber(valorMovimientoSaldo, DECIMALS.CINCO),
      // valorSaldoLectura: item.valorSaldoLectura,

      //  saldoOriginal: this.fS.instanceDecimal(valorMovimientoSaldo, DECIMALS.CINCO),
      //  posfechado: this.esAbonoPosfechado
      esPosfechado: this.esAbonoPosfechado,
    });
    // item.saldo = this.fS.instanceDecimal(item.saldo, DECIMALS.CINCO);

    // item.saldoOriginal = this.fS.minus(item.saldoOriginal, abono, DECIMALS.CINCO);
  };
}
