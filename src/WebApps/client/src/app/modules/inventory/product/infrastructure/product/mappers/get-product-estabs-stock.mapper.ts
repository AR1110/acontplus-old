import { ApiResponse } from '@core/models/api-response';
import { GetProductEstabStockResult } from '@inventory/product/domain/entities/product.entity';

export class GetProductEstabsStockMapper {
  static toJson(id: number) {
    return JSON.stringify({ idArticulo: id, tipo: 10 });
  }

  static fromJson(response: ApiResponse): GetProductEstabStockResult {
    const result = {
      establishments: [] as any[],
    };
    if (response.code === '1') {
      const { establishments } = JSON.parse(response.payload as string);
      console.log(establishments);
      result.establishments = establishments.map((item: any, index: number) => {
        const warehouses = JSON.parse(item.warehouses);
        console.log(warehouses);
        return {
          index,
          nameEstab: item.branchOffice,
          warehouses: warehouses.map((item: any) => {
            return {
              nameWarehouse: item.bodega,
              stock: item.stock,
              ubication: item.ubicacion,
            };
          }),
        };
      });
    }

    return result;
  }
}
