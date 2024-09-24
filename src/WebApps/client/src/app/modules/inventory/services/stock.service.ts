import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse } from '@core/models/api-response';

import { INVENTORY_PATHS } from '../enums/inventory.enum';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.STOCK}`;
  private http = inject(HttpClient)

  put(productId: number){
    return this.http.put<ApiResponse>(`${this.url}${productId}`, null)
  }

}
