import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { StockRepository } from '@inventory/data/repositories/stock.repository';

@Injectable({
  providedIn: 'root',
})
export class StockHttp implements StockRepository {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.STOCK}`;
  private http = inject(HttpClient);

  put(productId: number) {
    return this.http.put<ApiResponseLegacy>(`${this.url}${productId}`, null);
  }
}
