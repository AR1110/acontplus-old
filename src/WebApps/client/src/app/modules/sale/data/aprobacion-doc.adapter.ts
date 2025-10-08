import { formatDateToString } from '@core/utils/date.util';

interface Comprobante {
  idCliente: number;
  idTiempoCredito: number;
  idPuntoEmision: number;
  fechaEmision: string;
  codDoc: string;
  subTotalSinImpuestos: number;
  totalDescuento: number;
  total: number;
  importeTotal: number;
  propina: number;
  docOrigen: string;
  docDestino: string;
  observacion: string;
}
interface Detail {
  orderIndex: number;
  idAprob_Document_Detailt: number;
  idTarifa: number;
  idArticulo: number;
  idTipoIva: number;
  idMedida: number;
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
  precioConIva: number;
  descuento: number;
  precioTotalSinImpuesto: number;
  nota: string;
  codigoPorcentaje: string;
  tarifa: number;
  valorImpuesto: number;
  llevaInventario: boolean;
  idBodega: number;
  fechaEmision: string;
}
interface ToProps {
  comprobante: Comprobante;
  detalles: Detail[];
  detallesDeleted: Detail[];
  selectedDocshistorial: any[];
  infoAdicionalDocumento: any[];
  datosAdicionalesArticulo: any[];
}
class AprobacionDocAdapter {
  to(obj: ToProps) {
    const {
      comprobante,
      detalles,
      detallesDeleted,
      selectedDocshistorial,
      infoAdicionalDocumento,
      datosAdicionalesArticulo,
    } = obj;

    // const itemsMainMapper = this.comprobanteTo(detalles);
    // const itemsDeletedMapper = this.detailTo(detallesDeleted)
    // const impuestos = fS.impuestoTarifaMapperTo(detalles);

    // const mergeItems = [
    //   ...itemsMainMapper,
    //   ...itemsDeletedMapper
    // ]

    // return {
    //   comprobante: service.infoComprobanteMapperTo(comprobante),
    //   detalles: mergeItems,
    //   impuestos,
    //   historial: selectedDocshistorial,
    //   infoAdicional: infoAdicionalDocumento,
    //   infoAdicionalArticulo: datosAdicionalesArticulo
    // }
  }

  protected comprobanteTo(data: any) {
    const result: Comprobante = {
      idCliente: data.idCliente,
      idTiempoCredito: data.idTiempoCredito,
      idPuntoEmision: data.idPuntoEmision,
      fechaEmision: data.fechaEmision,
      codDoc: data.codDoc,
      subTotalSinImpuestos: data.subTotalSinImpuestos,
      totalDescuento: data.totalDescuento,
      total: data.total,
      importeTotal: data.total,
      propina: data.propina,
      docOrigen: data.docOrigen,
      docDestino: data.docDestino,
      observacion: data.observacion,
    };
    return result;
  }

  protected detailTo(details: any[]) {
    const results = details.map((item, index) => {
      const obj = {
        orderIndex: index++,
        idAprob_Document_Detailt: item.idAprob_Document_Detailt || 0,
        idTarifa: item.idTarifa,
        idArticulo: item.idArticulo,
        idTipoIva: item.idTipoIva,
        idMedida: item.idMedida,
        cantidad: item.cantidad,
        descripcion: item.descripcion,
        precioUnitario: item.precioUnitario,
        precioConIva: item.precioConIva,
        descuento: item.valorDescuento,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto,
        codigoPorcentaje: item.codigoPorcentaje, //✅
        tarifa: item.tarifa, //✅
        valorImpuesto: item.valorImpuesto, //✅
        llevaInventario: item.llevaInventario,
        idBodega: item.idBodega,
        fechaEmision: formatDateToString(item.fechaEmision),
        nota: item.nota,
      };
      return obj;
    });
    return results;
  }
}

export const aprobacionDocAdapter = new AprobacionDocAdapter();
