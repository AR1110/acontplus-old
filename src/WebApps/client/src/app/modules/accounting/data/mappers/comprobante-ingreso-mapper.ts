import { isValidField } from '@core/utils/utils';
import { roundNumber } from '@core/utils/round-number.utils';

interface ToApiCreateProps {
  comprobante: any;
  cobros: any[];
  cobroDetalle: any[];
  historialCobros: any[];
}

export class ComprobanteIngresoMapper {
  static fromApiGetAll(response: any) {
    const comprobanteIngreso = response.comprobanteIngreso || [];

    const data = comprobanteIngreso.map((item: any) => {
      return {
        codDoc: 'CI',
        idComprobanteIngreso: item.idComprobanteIngreso,
        idDocumento: item.idDocumento,
        codEstab: item.codEstab,
        total: item.total,
        fechaRegistro: item.fechaRegistro,
        abono: item.abono,
        cambio: item.cambio,
        nroDoc: item.nroDoc,
        nroIdentificacion: item.nroIdentificacion,
        nomCliente: item.cliente,
        nomCaja: item.caja,
        style: item.style,
        nomEstado: item.estado,
        nomUsuario: item.usuario,
        telefonoEstab: item.telefonoEstab,
        correoEstab: item.correoEstab,
        nombreEstab: item.nombreEstab,
      };
    });

    return {
      data,
    };
  }

  static toApiCreate(obj: ToApiCreateProps) {
    const { comprobante, cobros, cobroDetalle, historialCobros } = obj;

    const comprobanteMappeado = {
      idCliente: comprobante.idCliente,
      total: comprobante.total,
      abono: comprobante.abono,
      codEstab: comprobante.codEstab,
      numeroIdentificacion: comprobante.numeroIdentificacion,
      nombreFiscal: comprobante.nombreFiscal,
    };

    const comprosMappeado = cobros.map((cobro) => {
      return {
        idSubEntidadFinanciera: cobro.idSubEntidadFinanciera,
        idEntidadFinanciera: cobro.idEntidadFinanciera,
        idBanco: isValidField(cobro.idBanco),
        idCuentaBancaria: isValidField(cobro.idCuentaBancaria),
        fechaEmision: cobro.fechaEmision,
        valor: cobro.valor,
        posfechado: cobro.posfechado,
        secuencial: cobro.secuencial,
        infoCobro: cobro.infoCobro,
        abono: cobro.abono,
        controlCaja: cobro.controlCaja,
        idComprobante: isValidField(cobro.idComprobante),
        idTipoDocumento: isValidField(cobro.idTipoDocumento),
      };
    });

    const cobroDetalleMappeado = cobroDetalle.map((detalle) => {
      return {
        idCuentaPorCobrar: detalle.idCuentaPorCobrar,
        idCuotaPorCobrar: detalle.idCuotaPorCobrar,
        abono: roundNumber(detalle.abono, 5),
        interes: detalle.interes,
        diasMora: detalle.diasMora,
        mora: detalle.mora,
        cuota: roundNumber(detalle.cuota, 5),
        saldo: roundNumber(detalle.saldoOriginal, 5),
        secuencial: detalle.secuencial,
      };
    });

    const historialCobrosMappeado = historialCobros.map((hc) => {
      return {
        idCuentaPorCobrar: hc.idCuentaPorCobrar,
        abono: roundNumber(hc.abono, 5),
        diasMora: hc.diasMora,
        mora: hc.mora,
        saldo: roundNumber(hc.saldo, 5),
        secuencial: hc.secuencial,
      };
    });

    const objComprobanteIngreso = {
      comprobante: comprobanteMappeado,
      cobros: comprosMappeado,
      cobroDetalle: cobroDetalleMappeado,
      historial: historialCobrosMappeado,
    };
    return objComprobanteIngreso;
  }
}
