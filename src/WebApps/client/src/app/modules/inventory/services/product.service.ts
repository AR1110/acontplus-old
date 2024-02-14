import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '../constants/inventory.constants';
import { Observable, map } from 'rxjs';
import { ProductSearch } from '../models/product.model';
import { isApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT}`;

  search<T extends { textSearch: string }>(
    data: T
  ): Observable<Array<ProductSearch>> {
    let query = {
      textSearch: data.textSearch,
    };
    return this.http
      .get(`${this.url}Search?json=${JSON.stringify(query)}`)
      .pipe(
        map((response) => {
          if (isApiResponse(response)) {
            let products =
              (response.payload && JSON.parse(response.payload as string)) ||
              [];
            return products;
          }
          return [];
        })
      );
  }
}
