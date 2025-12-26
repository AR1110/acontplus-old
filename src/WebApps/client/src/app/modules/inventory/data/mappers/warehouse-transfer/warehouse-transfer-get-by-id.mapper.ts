import { formatDate } from '@core/utils/date.util';
import { mergeMeasureUtil } from '@inventory/utils/merge-measure.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

export class WarehouseTransferGetByIdMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 3,
    });
  }

  static fromJson(response: any): any {
    const data = {
      header: {},
      details: [],
    };

    if (response !== null && typeof response === 'object') {
      const { detalles: detailsTemp } = response;

      const header = response.comprobante[0];
      data.header = {
        id: header.idTransferenciaBodega,
        issueDate: formatDate(header.fechaEmision),
        issueDateCreated: formatDate(header.fechaEmision),
        sourceWarehouseId: header.idBodegaOrigen,
        destinationWarehouseId: header.idBodegaDestino,
        puntoEmisionId: header.idPuntoEmision,
        obs: header.observacion,
        total: header.total,
      };

      data.details = detailsTemp.map((item: any, index: number) => {
        const { fraccionado: fractional, principal: main, ...restItem } = item;

        const measures = mergeMeasureUtil(main, fractional);

        const measureData = measures.find((m) => m.idMedida === restItem.idMedida);
        if (!measureData) {
          console.log('Not found measure', restItem.descripcion, restItem.idMedida);
          throw new Error('Not found measure');
        }
        return {
          uuid: generateUuidv4(),
          index: index + 1,
          id: restItem.idTransferenciaBodegaDetalle,
          productId: restItem.idArticulo,
          measureId: restItem.idMedida,
          quantity: restItem.cantidad,
          description: restItem.descripcion,
          code: restItem.codigo,
          measures,
          fractionalCostPrice: measureData.precioCostoFraccionado,
          unitPrice: restItem.precioUnitario,
          costPrice: measureData.precioCosto,
          conversion: measureData.conversion,
          status: restItem.estado,
          total: restItem.total,
        };
      });
    }
    return data;
  }
}
