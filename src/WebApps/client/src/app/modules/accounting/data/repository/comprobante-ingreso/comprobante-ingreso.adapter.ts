import { roundNumber } from "@core/utils/round-number.utils";
import { isValidField } from "@core/utils/utils";

type ToProps = {
  comprobante: any,
  cobros: any[],
  cobroDetalle:any[],
  historialCobros:any[],
}
class ComprobanteIngresoAdapter {
  to(obj: ToProps){
    const {
      comprobante,
      cobros,
      cobroDetalle,
      historialCobros,
    } = obj;

    let comprobanteMappeado = {
      idCliente: comprobante.idCliente,
      total: comprobante.total,
      abono: comprobante.abono,
      codEstab: comprobante.codEstab,
      numeroIdentificacion: comprobante.numeroIdentificacion,
      nombreFiscal: comprobante.nombreFiscal
    }

    let comprosMappeado = cobros.map(cobro => {
      return {
        idSubEntidadFinanciera: cobro.idSubEntidadFinanciera,
        idEntidadFinanciera: cobro.idEntidadFinanciera,
        idBanco:  isValidField(cobro.idBanco),
        idCuentaBancaria:  isValidField(cobro.idCuentaBancaria),
        fechaEmision: cobro.fechaEmision,
        valor: cobro.valor,
        posfechado: cobro.posfechado,
        secuencial: cobro.secuencial,
        infoCobro: cobro.infoCobro,
        abono: cobro.abono,
        controlCaja: cobro.controlCaja,
        idComprobante: isValidField(cobro.idComprobante),
        idTipoDocumento: isValidField(cobro.idTipoDocumento)
      }
    })

    const cobroDetalleMappeado = cobroDetalle.map(detalle => {
      return {
        idCuentaPorCobrar: detalle.idCuentaPorCobrar,
        idCuotaPorCobrar: detalle.idCuotaPorCobrar,
        abono:roundNumber(detalle.abono, 5),
        interes: detalle.interes,
        diasMora: detalle.diasMora,
        mora: detalle.mora,
        cuota:roundNumber(detalle.cuota, 5),
        saldo:roundNumber(detalle.saldoOriginal, 5),
        secuencial: detalle.secuencial,
      }
    })

    const historialCobrosMappeado = historialCobros.map(hc => {
      return {
        idCuentaPorCobrar: hc.idCuentaPorCobrar,
        abono:roundNumber(hc.abono, 5),
        diasMora: hc.diasMora,
        mora: hc.mora,
        saldo:roundNumber(hc.saldo, 5),
        secuencial: hc.secuencial
      }
    })

    const objComprobanteIngreso = {
      comprobante: comprobanteMappeado,
      cobros: comprosMappeado,
      cobroDetalle: cobroDetalleMappeado,
      historial: historialCobrosMappeado,
    }
    return objComprobanteIngreso;
  }
}


export const comprobanteIngresoAdapter = new ComprobanteIngresoAdapter()
