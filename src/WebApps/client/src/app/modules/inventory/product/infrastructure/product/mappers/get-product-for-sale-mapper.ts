import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';
import { ProductSale } from '@inventory/product/domain/entities/product.entity';
import { MedidaProducto } from '@inventory/domain/models/measure.model';
import { ProductMapper } from '@inventory/product/infrastructure/product/mappers/product.mapper';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

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
    };

    if (response.code === '1') {
      const {
        product,
        fractionedMeasures,
        measures,
        inventoryAdjustment = [],
        additionalInfo = [],
      } = JSON.parse(response.payload as string);

      results.product = product[0];

      results.medidas = mergeMeasureUtil(measures, fractionedMeasures);

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
    }

    return results;
  }
}
