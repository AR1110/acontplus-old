import { CuentaPorPagarCuotaConfig, CuentaPorPagarLista } from "../cuenta-por-pagar/cuenta-por-pagar.interface"
import {ComprobanteEgresoLista} from "@accounting/comprobante-egreso/comprobante-egreso.interface";
import {PagoDetalleLista} from "@accounting/cuenta-por-pagar/pago-detalle.interface";
import {HistorialPagoLista} from "@accounting/cuenta-por-pagar/historial-pago.interface";

export class CuentaPorPagarAdapter {

  static fromApiGetAll(response: any[]): CuentaPorPagarLista[] {

    return response.map((item, index: number) => {

      return {
        index: index + 1,
        idCuentaPorPagar: item.idCuentaPorPagar,
        idTiempoCredito: item.idTiempoCredito,
        idProveedor: item.idProveedor,
        codEstab: item.codEstab,
        identificacionComprador: item.identificacion,
        nombreComprador: item.nombreFiscal,
        nombreDoc: item.codDoc, //revisar ,
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
        totalRecords: item.totalRecords
      }


    })
  }

  static fromApiCuotaConfig(response: any[]): CuentaPorPagarCuotaConfig[] {

    return response.map(item => {

      return {
        idCuotaPorPagar: item.idCuotaPorPagar,
        idCuentaPorPagar: item.idCuentaPorPagar,
        fechaVencimiento: item.fechaVencimiento,
        nroCuota: item.nroCuota,
        cuota: item.cuota,
        abono: item.abono,
        saldo: item.saldo,
        nombreEstado: item.descripcion,
        codigoEstado: item.codigo,
      }

    })


  }


  static  fromApiHistMovimiento(response: any[]){
    const [tempCuentaPorPagar, tempComprobanteEgreso, tempHistorialPagos, tempPagosDetalle] = response;

    const {
      serieComprobante,
      fechaEmision,
      identificacionProveedor,
      razonSocialProveedor,
      importeTotal,
      abono,
      saldo
    } = tempCuentaPorPagar[0];

    return {
      cuentaPorPagar: {
        serieComprobante,
        fechaEmision,
        identificacionComprador: identificacionProveedor,
        nombreComprador: razonSocialProveedor,
        total: importeTotal,
        abono,
        saldo
      } as Partial<CuentaPorPagarLista>,

      comprobantesEgreso: tempComprobanteEgreso.map((item:any, index: number)=>{

        return {
          index: index + 1,
          idComprobanteEgreso: item.idComprobanteEgreso,
           fechaEmision: item.fechaEmision,
          serieComprobante: item.serieComprobante,
          total: item.total,
          nombreEstado: item.nombreEstado,
          estado: item.estado,
          codEstab: item.codEstab,
        }

      }) as ComprobanteEgresoLista[],


      historialPagos: tempHistorialPagos.map((item:any)=>{
        return {
           idComprobanteEgreso: item.idComprobanteEgreso,
          idPago: item.idPago,
          nombrePosfechado : item.nombrePosfechado,
          fechaEmision : item.fechaEmision,
          nombreFormaPago : item.nombreFormaPago,
          nombreBanco : item.nombreBanco,
           valor: item.valor,
           abono: item.abono,
           vuelto: item.vuelto,
          codigoFormaPago : item.codigoFormaPago,
          nro: item.nro,
          lote: item.lote,
          referencia: item.referencia,
          aprobacion: item.aprobacion,

        }
      }) as HistorialPagoLista[],

      pagosDetalle: tempPagosDetalle.map((item:any)=>{
        return {
          idPago:item.idPago,
          nroCuota:item.nroCuota,
          fechaVencimiento:item.fechaVencimiento,
          cuota:item.cuota,
          abono:item.abono,
          saldo:item.saldo,
        }

      }) as PagoDetalleLista[]

    }


  }

}
