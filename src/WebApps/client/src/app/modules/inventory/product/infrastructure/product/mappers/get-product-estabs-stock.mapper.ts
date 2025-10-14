import { ApiResponse } from '@core/models/api-response';
import {GetProductEstabStockResult} from '@inventory/product/domain/entities/product.entity';

export class GetProductEstabsStockMapper {
  static toJson(id: number) {
    return JSON.stringify({ idArticulo: id, tipo: 10 });
  }

  static fromJson(response: ApiResponse): GetProductEstabStockResult {

    console.log(JSON.parse(response.payload as string))

    return {
      estabsWarehouses: []
    }

  }
}
