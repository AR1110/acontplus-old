import { mergeMeasureUtil, mergeProductMeasures } from '@inventory/domain/utils/merge-measure.util';
import { ProductSale } from '@inventory/product/domain/entities/product.entity';
import { MedidaProducto } from '@inventory/domain/models/measure.model';
import { ProductMapper } from '@inventory/product/infrastructure/product/mappers/product.mapper';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ProductMeasure } from '@inventory/domain/models/product-measure';

export class GetProductForSaleMapper {
  static toJson(obj: { id?: number; search?: string }) {
    return JSON.stringify({
      idArticulo: obj.id || undefined,
      bySearch: obj.search || undefined,
      tipo: 6,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    const results = {
      product: {} as ProductSale,
      medidas: [] as MedidaProducto[],
      consolidacionesFecha: [] as any[],
      additionalInfo: [] as any[],
      inventoryAdjustments: [] as any[],

      measures: [] as ProductMeasure[],
      taxRates: [] as any[],
    };

    if (response.code === '1') {
      const {
        product,
        fractionedMeasures,
        measures,
        inventoryAdjustment = [],
        additionalInfo = [],
        taxes = [],
      } = JSON.parse(response.payload as string);

      const productTemp = product[0];
      results.product = {
        ...productTemp,

        //nombres estandarizados
        code: productTemp.codigoArticulo,
        description: productTemp.descripcion,
        taxCode: productTemp.codigoPorcentaje,
      };

      results.medidas = mergeMeasureUtil(measures, fractionedMeasures);

      results.measures = mergeProductMeasures(measures, fractionedMeasures);

      const consolidacionesFecha = inventoryAdjustment.map((data: any) => ({
        ...data,
        fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion),
      }));

      results.consolidacionesFecha = consolidacionesFecha; // eliminar una vez migrado todo

      results.inventoryAdjustments = consolidacionesFecha;

      results.additionalInfo = additionalInfo.map((item: any) => ({
        productId: item.idArticulo,
        tagId: item.idEtiqueta,
        additionalInfoId: item.idInfoAdicional,
        additionalJson: item.jsonAdicional ? JSON.parse(item.jsonAdicional) : null,
        uniqueId: item.uniqueId,
        status: item.estado,
      }));

      results.taxRates = taxes.map((item: any) => ({
        id: item.idTarifaImpuesto,
        code: item.codigoPorcentaje,
        name: item.descripcion,
      }));
    }
    console.log(results);

    return results;
  }
}
