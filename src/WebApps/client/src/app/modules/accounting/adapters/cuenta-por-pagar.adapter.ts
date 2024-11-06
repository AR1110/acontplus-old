import { CuentaPorPagarLista } from "../cuenta-por-pagar/cuenta-por-pagar.interface"

export class CuentaPorPagarAdapter {

  static fromApiGetAll(response:any[]): CuentaPorPagarLista[] {

    return response.map((item, index:number)=>{

      return {
        index: index + 1,
        idCuentaPorPagar: item.idCuentaPorPagar,
        idTiempoCredito: item.idTiempoCredito,
        idProveedor: item.idProveedor,
        codEstab:item.codEstab,
        identificacionComprador: item.identificacion,
        nombreComprador: item.nombreFiscal,
        nombreDoc: item.codDoc, //revisar ,
        serieComprobante: item.serieComprobante,
        fechaEmision: item.fechaEmision,
        fechaVencimiento: item.fechaVencimiento,
        total: item.importeTotal,
        abono: item.abono,
        saldo: item.saldo,
        diasCredito:item.diasCredito,
        nombreEstado: item.estado,
        codigoEstado: item.codPago,
        numAutDocSustento: item.numAutDocSustento,
        totalRecords:item.totalRecords
    }


    })


  }
}
