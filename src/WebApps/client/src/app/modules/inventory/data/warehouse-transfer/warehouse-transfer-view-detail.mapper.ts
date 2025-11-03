import { formatDate } from '@core/utils/date.util';
import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

export class WarehouseTransferViewDetailMapper {
  static toJson(id: number) {
    return JSON.stringify({
      tipo: 5,
      id,
    });
  }

  static fromJson(response: any): any {
    const data = {
      header: {},
      details: [],
    };
    if (response !== null && typeof response === 'object') {
      const { comprobante, detalles } = response;

      const {
        idTransferenciaBodega,
        establecimientoOrigen,
        establecimientoDestino,
        ptoEmi,
        bodegaOrigen,
        bodegaDestino,
        fechaEmision,
        observacion,
        total,
      } = comprobante[0];

      data.header = {
        id: idTransferenciaBodega,
        sourceEstablishment: establecimientoOrigen,
        destinationEstablishment: establecimientoDestino,
        ptoEmi,
        sourceWarehouse: bodegaOrigen,
        destinationWarehouse: bodegaDestino,
        issueDate: formatDate(fechaEmision),
        observation: observacion,
        total,
      };
      data.details = detalles.map((item: any, index: number) => {
        return {
          index: index + 1,
          id: item.idTransferenciaBodegaDetalle,
          quantity: item.cantidad,
          description: item.descripcion,
          code: item.codigo,
          measure: item.medida,
          costPrice: item.precioCosto,
          total: item.total,
        };
      });
    }
    return data;
  }
}
