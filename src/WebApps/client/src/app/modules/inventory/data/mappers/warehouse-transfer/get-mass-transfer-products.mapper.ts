import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';
import DecimalUtils from '@core/utils/decimal.util';

export class GetMassTransferProductsMapper {
  static toJson(obj: any) {
    return JSON.stringify({
      tipo: 6,
      subFamilias: obj.subCategories,
      bodegaId: obj.sourceWarehouseId,
    });
  }

  static fromJson(response: any) {
    const result = {
      products: [],
      totalRecords: 0,
    };

    if (response && typeof response === 'object') {
      const { articulos: items = [] } = response;

      result.products = items.map((item: any) => {
        const { principal: mainUnit, fraccionado: fractionalUnit, ...rest } = item;
        const measures = mergeMeasureUtil(mainUnit, fractionalUnit);

        const selectedMeasure = measures.find((m) => m.idMedida === rest.measureId);

        return {
          id: rest.idArticulo,
          code: rest.codigo,
          description: rest.descripcion,
          quantity: rest.cantidad,
          costPrice: rest.precioCosto,
          unitPrice: selectedMeasure?.precioUnitario,
          fractionalCostPrice: selectedMeasure?.precioCostoFraccionado,
          measureId: rest.idMedida,
          measureName: rest.nomMedida,
          measures,
          conversion: selectedMeasure?.conversion,
          total: DecimalUtils.multiplyAsNumber(rest.cantidad, rest.precioCosto),
        };
      });
      result.totalRecords = items.length > 0 ? items[0].totalRecords : 0;
    }

    return result;
  }
}
