import { roundNumber } from "@/core/utils/round-number.util";
import { isValidField } from "@/core/utils/utils";
import { DECIMALS } from "@/enums/main.enum";
import { Cobro, CobroDetalle, HistorialCuenta } from "@/models/contabilidad/payment.model";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})
export class ComprobanteIngresoAdapter {


  postTo<T extends { comprobante: any, cuentasPorCobrarEstado: any[], cuotasPorCobrarEstado: any[], cobros: Cobro[], cobrosDetalle: CobroDetalle[], historialCuentas: HistorialCuenta[] }>(obj: T) {
    const {
      comprobante,
      cobros,
      cobrosDetalle,
      historialCuentas,
      cuentasPorCobrarEstado,
      cuotasPorCobrarEstado
    } = obj;

    let comprobanteMappeado = {
      idCliente: comprobante.idCliente,
      total: comprobante.total,
      abono: comprobante.abono,
      codEstab: comprobante.codEstab,
      observacion: isValidField(comprobante.observacion)
    }

    let cobrosMappeado = cobros.map(cobro => {
      return {
        idSubEntidadFinanciera: cobro.idSubEntidadFinanciera,
        idEntidadFinanciera: cobro.idEntidadFinanciera,
        idBanco: isValidField(cobro.idBanco),
        idCuentaBancaria: 0,
        fechaEmision: cobro.fechaEmision,
        valor: cobro.valorAbono,
        posfechado: cobro.posfechado,
        cobro: cobro.cobro,
        secuencial: cobro.secuencial,
        infoCobro: cobro.infoCobro,
        abono: cobro.abonoCuota,
        controlCaja: cobro.controlCaja,
        idComprobante: null,
        idTipoDocumento: null,
        observacion: isValidField(cobro.observacion)
      }
    })

    const cobroDetalleMappeado = cobrosDetalle.map(item => {
      return {
        idCuentaPorCobrar: item.idCuentaPorCobrar,
        idCuotaPorCobrar: item.idCuotaPorCobrar,
        abono: roundNumber(item.abono, DECIMALS.CINCO),
        interes: item.interesActual,
        diasMora: item.diasMoraActual,
        mora: item.interesPorMoraActual,
        saldo: roundNumber(item.saldoOriginal, DECIMALS.CINCO),
        secuencial: item.secuencial,
      }
    })

    const historialCobrosMappeado = historialCuentas.map(item => {
      return {
        idCuentaPorCobrar: item.idCuentaPorCobrar,
        abono: roundNumber(item.abono, DECIMALS.CINCO),
        diasMora: item.diasMoraActual,
        mora: item.interesPorMoraActual,
        saldo: roundNumber(item.saldo, DECIMALS.CINCO),
        secuencial: item.secuencial
      }
    })

    let cuenta = cuentasPorCobrarEstado.map(item => {
      return {
        idCuentaPorCobrar: item.idCuentaPorCobrar,
        idEstadoPago: item.idEstadoPago,
        abono: item.abono,
        diasMora: item.diasMoraActual,
        mora: item.interesPorMoraActual,
        interes: item.interesActual,
      }
    })

    let cuota = cuotasPorCobrarEstado.map(item => {
      return {
        idEstadoPago: item.idEstadoPago,
        abono: item.abono,
        idCuotaPorCobrar: item.idCuotaPorCobrar,
        diasMora: item.diasMoraActual,
        mora: item.interesPorMoraActual,
      }
    })




    const objComprobanteIngreso = {
      comprobante: comprobanteMappeado,
      cobros: cobrosMappeado,
      cobroDetalle: cobroDetalleMappeado,
      historial: historialCobrosMappeado,
      cuenta,
      cuota
    }

    return objComprobanteIngreso;
  }




}
