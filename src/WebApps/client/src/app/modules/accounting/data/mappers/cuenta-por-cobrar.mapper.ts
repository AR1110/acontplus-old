import { groupEstabUtil } from '@core/utils/group-estab.util';

export class CuentaPorCobrarMapper {
  static fromApiGetAll(response: any) {
    const cuentasPorCobrar = response.cuentasPorCobrar || [];
    const data = cuentasPorCobrar.map((cxc: any, index: number) => {
      return {
        index: index + 1,
        idCuentaPorCobrar: cxc.idCuentaPorCobrar,
        codDoc: cxc.codDoc,
        razonSocialComprador: cxc.razonSocialComprador,
        serieComprobante: cxc.serieComprobante,
        fechaEmision: cxc.fechaEmision,
        fechaVencimiento: cxc.fechaVencimiento,
        importeTotal: cxc.importeTotal,
        abono: cxc.abono,
        saldo: cxc.saldo,
        tiempoCredito: cxc.tiempoCredito,
        estado: cxc.estado,
        codEstado: cxc.codEstado,
        idCliente: cxc.idCliente,
        codEstab: cxc.codEstab,
        identificacionComprador: cxc.identificacionComprador,
        diasMora: cxc.diasMora,
        mora: cxc.mora,
      };
    });

    return {
      data,
    };
  }

  static fromApiGetCuotasById(response: any) {
    const cuotas = response.cuotas || [];

    const data = cuotas.map((cuota: any) => {
      return {
        idCuotaPorCobrar: cuota.idCuotaPorCobrar,
        idCuentaPorCobrar: cuota.idCuentaPorCobrar,
        nroCuota: cuota.nroCuota,
        cuota: cuota.cuota,
        mora: cuota.mora,
        interes: cuota.interes,
        diasMora: cuota.diasMora,
        abono: cuota.abono,
        saldoCta: cuota.saldoCta,
        saldo: cuota.saldo,
        estado: cuota.estado,
        saldoOriginal: cuota.saldo,
      };
    });

    return data;
  }
}
