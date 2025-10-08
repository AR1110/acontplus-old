import { ApiResponse } from '@core/models/api-response';
import { GetProductPurchaseResult } from '@inventory/product/domain/entities/product.entity';
import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';

export class GetProductPurchaseMapper {
  static toJson(id: number) {
    return JSON.stringify({ idArticulo: id, tipo: 9 });
  }

  static fromJson(response: ApiResponse): GetProductPurchaseResult {
    const result = new GetProductPurchaseResult();
    console.log(JSON.parse(response.payload as string));
    const { product, measures, fractionedMeasures, tags } = JSON.parse(response.payload as string);
    const data = product[0];
    const articulo = {
      id: data.idArticulo,
      vatTypeId: data.idTipoIva,
      auxiliaryCode: data.codigoAuxiliar,
      description: data.descripcion,
      code: data.codigoArticulo,
      stock: data.stock,
      minWholesaleQty: data.cantMinimaVentaPorMayor,
      iceValue: data.valorIce,
      hasInventory: data.llevaInventario,
      hasAdditionalData: data.datosAdicionales,
      isFractionable: data.productoFraccionable,
      costPrice: data.precioCosto,
      priceWithoutSubsidy: data.precioSinSubsidio,
      vatTypeName: data.nombreTipoIva,
      rate: data.tarifa,
      percentageCode: data.codigoPorcentaje,
    };

    const medidas = mergeMeasureUtil(measures, fractionedMeasures);

    const etiquetasMapper = tags.map((item: any) => ({
      idEtiqueta: item.idEtiqueta,
      descripcion: item.descripcion,
      etiquetas: item.etiquetas.split(';'),
    }));

    result.data = articulo;
    result.measures = medidas;
    result.tags = etiquetasMapper;

    return result;
  }
}
