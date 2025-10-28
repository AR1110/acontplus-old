import { impuestoDetailAdapter } from '@shared/adapters/impuesto-detail.adapter';
import { NotaEntregaComprobanteApi, NotaEntregaDetailApi } from './nota-entrega-api.model';
import { NotaEntregaDetail } from '@sale/domain/models/nota-entrega.model';
import { formatDateToString } from '@core/utils/date.util';
interface MainAdapt {
  comprobante: any;
  details: NotaEntregaDetail[];
  cuotas: any[];
  infoAdicionalDoc: any[];
}

class NotaEntregaAdapter {
  mainAdapt(input: MainAdapt) {
    const comprobante = this.comprobanteAdapt(input.comprobante);

    const details = this.detailAdapt(input.details);
    const impuestos = impuestoDetailAdapter.to(input.details);
    const infoAdicionalDoc = input.infoAdicionalDoc.map(item => {
      return {
        nombre: item.name,
        valor: item.value,
      };
    });

    return {
      notaEntrega: comprobante,
      detalles: details,
      impuestos: impuestos,
      infoAdicional: infoAdicionalDoc,
      infoAdicionalArticulo: [],
      cuotas: input.cuotas,
    };
  }

  comprobanteAdapt(obj: any) {
    const result: NotaEntregaComprobanteApi = {
      uniqueId: obj.uniqueId, //se envia cuando el documento proviene desde el modulo de aprobacion
      idCliente: obj.idCliente,
      idTiempoCredito: obj.idTiempoCredito,
      idPuntoEmision: obj.idPuntoEmision,
      idUsuario: obj.idUsuario,
      fechaEmision: formatDateToString(obj.fechaEmision),
      fechaVencimiento: formatDateToString(obj.fechaVencimiento),
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
      supportId: obj.supportId,
    };
    return result;
  }

  detailAdapt(input: NotaEntregaDetail[]): NotaEntregaDetailApi[] {
    const results = input.map((item, index) => {
      const cantidadTransaccion = item.quantity * (item.conversion || 1);
      const obj = {
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
      };
      return obj;
    });
    return results;
  }
}

export const notaEntregaAdapter = new NotaEntregaAdapter();
