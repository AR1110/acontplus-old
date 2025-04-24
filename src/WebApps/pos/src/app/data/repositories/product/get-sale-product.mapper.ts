import {ProductSearchDto, ProductSearchParams} from "@domain/models/inventory/product.model";
import {ApiResponse} from "acontplus-utils";
import {imgDefault, sanitizeAndEncodeURIComponent} from "@domain/utils/utils";
import {Tarifa} from "@domain/models/inventory/tarifa.model";

export class SearchProductMapper {
  static toJson(params:ProductSearchParams) {
    return JSON.stringify({
      pageIndex: 1,
      pageSize: 30,
      busqueda: sanitizeAndEncodeURIComponent(params.textSearch),
    })
  }

  static fromJson(response:ApiResponse){
    const productsFound = JSON.parse(response.payload as string) ?? [];
    const results : ProductSearchDto[] = productsFound.map((item: any) => {
        const tempTarifas: any[] = JSON.parse(item.priceSale) || [];
        const tarifas: Tarifa[] = tempTarifas.map((tarifa) => ({
          idTarifa: tarifa.idTarifa,
          descripcion: tarifa.tarifa,
          precioVenta: tarifa.precioVenta,
          precioConIva: tarifa.precioConIva,
          default: tarifa.predeterminada,
        }));
        return {
          idArticulo: item.idArticulo,
          codigo: item.codigo,
          descripcion: item.descripcion,
          iva: item.iva,
          tarifas: tarifas,
          s3ObjectUrl: item.s3ObjectUrl || imgDefault,
        };
      });
      return results;
  }
}
