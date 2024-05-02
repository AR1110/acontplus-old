
import { formatDateMoment } from "@core/utils/format-date-moment";
import { impuestoDetailAdapter } from "@shared/adapters/impuesto-detail.adapter";
import { InvoiceDetail } from "@modules/billing/models/invoice.model";
import { InvoiceComprobanteApi, InvoiceDetailApi } from "./invoice-api.model";
type MainAdapt = {
  comprobante: any
  details: InvoiceDetail[],
  cuotas: any[],
  formaPago: any[]
}

class InvoiceAdapter {
  mainAdapt(input: MainAdapt) {
    let comprobante = this.comprobanteAdapt(input.comprobante)

    const details = this.detailAdapt(input.details);
    const impuestos = impuestoDetailAdapter.to(input.details);


    return {
      infoFactura: comprobante,
      detalles: details,
      impuestos: impuestos,
      infoAdicional: [],
      infoAdicionalArticulo: [],
      formaPago: input.formaPago,
      cuotas: input.cuotas,
    }

  }

  comprobanteAdapt(obj: any) {
    const result: InvoiceComprobanteApi = {
      uniqueId: obj.uniqueId, //se envia cuando el documento proviene desde el modulo de aprobacion
      idCliente: obj.idCliente,
      idTiempoCredito: obj.idTiempoCredito,
      idPuntoEmision: obj.idPuntoEmision,
      idUsuario: obj.idUsuario,
      fechaEmision: formatDateMoment(obj.fechaEmision),
      fechaVencimiento: formatDateMoment(obj.fechaVencimiento),
      subTotalSinImpuestos: obj.subTotalSinImpuesto,
      totalDescuento: obj.totalDescuento || 0,
      porcentajeDescuento: obj.porcentajeDescuento || 0,
      //   irbpnr: obj.irbpnr || 0,
      propina: obj.propina || 0,
      recargo: obj.recargo || 0,
      transporte: obj.transporte || 0,
      total: obj.total,
      observacion: obj.observacion,
      //   placa: obj.placa,
      idTipoIdentificacion: obj.idTipoIdentificacion,
      identificacionComprador: obj.identificacionComprador,
      razonSocialComprador: obj.razonSocialComprador,
      direccionComprador: obj.direccionComprador,
      email: obj.email,
      telefono: obj.telefono,
      supportId: obj.supportId
    }
    return result;
  }

  detailAdapt(input: InvoiceDetail[]): InvoiceDetailApi[] {
    let results = input.map((item, index) => {
      let cantidadTransaccion = item.quantity * (item.conversion || 1)
      let obj = {
        orderIndex: index + 1,
        idArticulo: item.productId,
        idTarifa: item.feeId,
        idBodega: item.bodegaId,
        idMedida: item.medidaId,
        idTipoIva: item.idTipoIva,
        ice: item.ice || 0,
        cantidad: item.quantity,
        precioCosto: item.cost,
        precioUnitario: item.price,
        valorDescuento: item.discount,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto,
        codigoPorcentaje: item.codePercentage,
        tarifa: item.percentage || 0,
        porcentajeDescuento: item.percentageDiscount,
        valorImpuesto: item.taxValue,
        nota: item.obs || null,
        descripcion: item.descripcion,
        llevaInventario: item.llevaInventario,
        cantidadTransaccion,
        conversion: item.conversion,
        precioCostoFraccionado: item.costoFraccionado,
        precioSinSubsidio: item.precioSinSubsidio
      }
      return obj;
    })
    return results;
  }
}

export const invoiceAdapter = new InvoiceAdapter()

