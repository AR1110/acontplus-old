import { ComprobanteEgresoLista } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
import { PagoDetalle } from '@accounting/comprobante-egreso/domain/pago-detalle.model';
import { HistorialPagoLista } from '@accounting/comprobante-egreso/domain/historial-pago.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { formatDate } from '@core/utils/date.util';
import {
  CuentaPorPagarCuotaConfig,
  CuentaPorPagarLista,
} from '@accounting/data/models/cuenta-por-pagar.model';

export class CuentaPorPagarMapper {
  static fromApiDataFilter(response: ApiResponseLegacy) {
    const [tempEstabs, tempEstadosDoc, tempTiposDoc, tempCategorias] = JSON.parse(
      response.payload as string,
    );

    const dataToGroup = {
      estabs: tempEstabs,
      isGroupPuntoEmision: true,
    };

    return {
      estabs: groupEstabUtil(dataToGroup),
      estadosDoc: tempEstadosDoc,
      tiposDoc: tempTiposDoc,
      categorias: tempCategorias,
    };
  }

  static fromApiGetAll(response: any[]): CuentaPorPagarLista[] {
    return response.map((item, index: number) => {
      return {
        index: index + 1,
        idCuentaPorPagar: item.idCuentaPorPagar,
        idDocumento: item.idDocumento,
        idTiempoCredito: item.idTiempoCredito,
        idProveedor: item.idProveedor,
        codEstab: item.codEstab,
        identificacionComprador: item.identificacion,
        nombreComprador: item.nombreFiscal,
        nombreDoc: item.nombreDoc, //revisar ,
        codDoc: item.codDoc,
        serieComprobante: item.serieComprobante,
        fechaEmision: item.fechaEmision,
        fechaVencimiento: item.fechaVencimiento,
        total: item.importeTotal,
        abono: item.abono,
        saldo: item.saldo,
        diasCredito: item.diasCredito,
        nombreEstado: item.estado,
        codigoEstado: item.codPago,
        numAutDocSustento: item.numAutDocSustento,
        totalRecords: item.totalRecords,
      };
    });
  }

  static fromApiCuotaConfig(response: any[]): CuentaPorPagarCuotaConfig[] {
    return response.map((item) => {
      return {
        idCuotaPorPagar: item.idCuotaPorPagar,
        idCuentaPorPagar: item.idCuentaPorPagar,
        fechaVencimiento: formatDate(item.fechaVencimiento),
        nroCuota: item.nroCuota,
        cuota: item.cuota,
        abono: item.abono,
        saldo: item.saldo,
        nombreEstado: item.descripcion,
        codigoEstado: item.codigo,
      };
    });
  }

  static fromApiHistMovimiento(response: any[]) {
    const [tempCuentaPorPagar, tempComprobanteEgreso, tempHistorialPagos, tempPagosDetalle] =
      response;

    const {
      serieComprobante,
      fechaEmision,
      identificacionProveedor,
      razonSocialProveedor,
      importeTotal,
      abono,
      saldo,
    } = tempCuentaPorPagar[0];

    return {
      cuentaPorPagar: {
        serieComprobante,
        fechaEmision,
        identificacionComprador: identificacionProveedor,
        nombreComprador: razonSocialProveedor,
        total: importeTotal,
        abono,
        saldo,
      } as Partial<CuentaPorPagarLista>,

      comprobantesEgreso: tempComprobanteEgreso.map((item: any, index: number) => {
        return {
          index: index + 1,
          idComprobanteEgreso: item.idComprobanteEgreso,
          fechaEmision: item.fechaEmision,
          serieComprobante: item.serieComprobante,
          total: item.total,
          nombreEstado: item.nombreEstado,
          estado: item.estado,
          codEstab: item.codEstab,
        };
      }) as ComprobanteEgresoLista[],

      historialPagos: tempHistorialPagos.map((item: any) => {
        return {
          idComprobanteEgreso: item.idComprobanteEgreso,
          idPago: item.idPago,
          nombrePosfechado: item.nombrePosfechado,
          fechaEmision: item.fechaEmision,
          nombreFormaPago: item.nombreFormaPago,
          nombreBanco: item.nombreBanco,
          valor: item.valor,
          abono: item.abono,
          vuelto: item.vuelto,
          codigoFormaPago: item.codigoFormaPago,
          nro: item.nro,
          lote: item.lote,
          referencia: item.referencia,
          aprobacion: item.aprobacion,
        };
      }) as HistorialPagoLista[],

      pagosDetalle: tempPagosDetalle.map((item: any) => {
        return {
          idPago: item.idPago,
          nroCuota: item.nroCuota,
          fechaVencimiento: item.fechaVencimiento,
          cuota: item.cuota,
          abono: item.abono,
          saldo: item.saldo,
        };
      }) as PagoDetalle[],
    };
  }

  static toApiGenerarCuota(obj: any) {
    return {
      idCuentaPorPagar: obj.idCuentaPorPagar,
      idTiempoCredito: obj.tiempoCreditoId,
      codPago: obj.codigoEstado,
    };
  }
}
