import {
  GetSaleProductParams,
  GetSaleProductResponse,
} from "@domain/models/inventory/product.model";
import {ApiResponse} from "acontplus-utils";
import {MedidaProducto} from "@domain/models/inventory/medida.model";
import {mergeMeasureFromAdapter} from "@data/mappers/medida.adapter";

export class GetSaleProductMapper {
  static toJson(params:GetSaleProductParams) {
    return JSON.stringify({
      idArticulo: params.productId,
      idBodega: params.bodegaId,
      tipo: 6,
    })
  }

  static fromJson(response:ApiResponse): GetSaleProductResponse{
    const {
      product,
      measures: medidasPrincipal,
      fractionedMeasures: medidasFraccionado,
      inventoryAdjustment: productoConsolidaciones,
      //additionalInfo,
    } =  JSON.parse(response.payload as string);

    const resultMedidas: MedidaProducto[] = mergeMeasureFromAdapter(
      medidasPrincipal,
      medidasFraccionado
    );

    const productoConsolidacionesResult = productoConsolidaciones.map(
      (item: any) => {
        return {
          ...item,
          fechaConsolidacion:
            item.fechaConsolidacion && new Date(item.fechaConsolidacion),
        };
      }
    );

    return {
      product: product[0] || {},
      medidas: resultMedidas,
      productoConsolidaciones: productoConsolidacionesResult,
    };
  }
}
