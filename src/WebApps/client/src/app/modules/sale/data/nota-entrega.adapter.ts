import { DECIMALS } from "@core/constants/global.constants";
import { fechaString, formatDate } from "@core/utils/date.util";
import { roundNumber } from "@core/utils/round-number.utils";

//DeliveryNoteAdapter sugerencia en ingles
export class NotaEntregaAdapter {
  static fromApiDetalleCompleto(response: any) {
    const [tempHeader, tempCliente, tempDetalles, datosAdicionalesDoc, tiposIva] = response;
    const header = tempHeader[0] || {};
    const cliente = tempCliente[0] || {};

    const result = {
      headerData: {
        estabNombre: header.nombreComercial,
        serieComprobante: header.serieComprobante,
        fechaEmision: fechaString(formatDate(header.fechaEmision)),
        fechaVencimiento: fechaString(formatDate(header.fechaVencimiento)),
        subTotalSinImpuestos: header.subTotalSinImpuestos,
        totalDescuento: header.totalDescuento,
        porcentajeDescuento: header.porcentajeDescuento,
        propina: header.propina,
        recargo: header.recargo,
        transporte: header.transporte,
        total: header.total,
        tiempoCreditoNombre: header.tiempoCredito,
        empleadoNombre: header.empleado,
        observacion: header.observacion
      },
      clienteData: {
        razonSocialComprador: cliente.razonSocialComprador,
        identificacionComprador: cliente.identificacionComprador,
        direccionComprador: cliente.direccionComprador,
        correo: cliente.correo
      },
      detalles: tempDetalles.map((item:any) => {
        const precioConIva =   item.precioUnitario + item.valorImpuesto;
         const total = roundNumber(item.precioTotalSinImpuesto, DECIMALS.GENERAL) +  roundNumber(item.valorImpuesto, DECIMALS.GENERAL)
        return {
        idNotaEntregaDetalle: item.idNotaEntregaDetalle,
        codigo: item.codigo,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        porcentajeDescuento: item.porcentajeDescuento,
        valorDescuento: item.valorDescuento,
        ice: item.ice,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto,
        codigoPorcentaje: item.codigoPorcentaje,
        tarifaImpuesto: item.tarifa,
        valorImpuesto: item.valorImpuesto,
        nota: item.nota,
        bodegaNombre: item.bodega,
        medidaNombre: item.medida,
        tipoIvaNombre: item.tipoIva,
        pvpNombre: item.pvp,
        precioConIva: roundNumber(precioConIva, DECIMALS.DOS),
          total:  roundNumber(total, DECIMALS.DOS)
      }}),
      datosAdicionalesDoc,
      tiposIva
    };

    return result;
  }

  static fromApiAll(response: any[]) {
    return response.map((item: any) => {
      return {
        idCuentaPorCobrar: item.idCuentaPorCobrar,
        idDocumento: item.idDocumento,
        codEstab: item.codEstab,
        fechaEmision: item.fechaEmision,
        fechaVencimiento: item.fechaVencimiento,
        serieComprobante: item.serieComprobante,
        razonSocialComprador: item.nombreFiscal,
        identificacionComprador: item.identificacionComprador,
        estadoNom: item.estadoFinanciero,
        total: item.total,
        abono: item.abono,
        saldo: item.saldo,
        usuario: item.usuario,
        tiempoCredito: item.tiempoCredito,
        codEstado: item.codEstado,
        convertToDoc: item.convertToDoc,
        totalRecords: item.totalRecords,
      }
    })
  }
}
