import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { FractionalProductRepository } from '@inventory/data/repositories/fractional-product.repository';
import { FractionalProductDataSave } from '@inventory/data/models/fractional-product.model';
import {
  FractionalProductGetAllMapper,
  FractionalProductPostMapper,
  FractionalProductGetIdMapper,
} from '@inventory/data/mappers/fractional-product.mapper';

@Injectable({
  providedIn: 'root',
})
export class FractionalProductHttp implements FractionalProductRepository {
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
      .pipe(map((response) => FractionalProductGetAllMapper.fromJson(response)));
  }

  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 2,
    });
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => FractionalProductGetIdMapper.fromJson(response)));
  }

  post(obj: FractionalProductDataSave) {
    const data = FractionalProductPostMapper.toJson(obj);
    return this._http.post<ApiResponseLegacy>(`${this._url}`, { data });
  }
  put(obj: FractionalProductDataSave): Observable<ApiResponseLegacy> {
    const data = FractionalProductPostMapper.toJson(obj);
    return this._http.put<ApiResponseLegacy>(`${this._url}${obj.id}`, { data });
  }
}
