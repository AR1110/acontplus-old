import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { FractionalProductRepository } from '@inventory/product/domain/repositories/fractional-product.repository';
import { FractionalProductGetAllMapper } from '@inventory/product/infrastructure/fractional-product/fractional-product-get-all.mapper';
import {
  FractionalProductDataSave,
} from '@inventory/product/domain/entities/fractional-product.model';
import { FractionalProductPostMapper } from '@inventory/product/infrastructure/fractional-product/fractional-product-post.mapper';
import { FractionalProductGetIdMapper } from '@inventory/product/infrastructure/fractional-product/fractional-product-get-id.mapper';

@Injectable({
  providedIn: 'root',
})
export class FractionalProductRepositoryImpl implements FractionalProductRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.FRACTIONAL_PRODUCT}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T) {
    const params = {
      json: JSON.stringify({ ...obj, tipo: 1 }),
    };
    return this._http
      .get(`${this._url}`, {
        params,
      })
      .pipe(map(response => FractionalProductGetAllMapper.fromJson(response)));
  }

  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 2,
    });
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map(response => FractionalProductGetIdMapper.fromJson(response)));
  }

  post(obj: FractionalProductDataSave) {
    const data = FractionalProductPostMapper.toJson(obj);
    return this._http.post<ApiResponse>(`${this._url}`, { data });
  }
  put(obj: FractionalProductDataSave): Observable<ApiResponse> {
    const data = FractionalProductPostMapper.toJson(obj);
    return this._http.put<ApiResponse>(`${this._url}${obj.id}`, { data });
  }
}
