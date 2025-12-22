import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { ProductUbicationRepository } from '@inventory/data/repositories/product-ubication.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductUbicationHttp implements ProductUbicationRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_UBICATION}`;
  private _http = inject(HttpClient);

  post<T>(obj: T) {
    const paramsJson = JSON.stringify(obj);
    return this._http.post<ApiResponseLegacy>(`${this._url}/?json=${paramsJson}`, null);
  }
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy> {
    const paramsJson = JSON.stringify(obj);
    return this._http.put<ApiResponseLegacy>(`${this._url}/${id}?json=${paramsJson}`, null);
  }
  remove(id: number): Observable<ApiResponseLegacy> {
    return this._http.delete<ApiResponseLegacy>(`${this._url}/${id}`);
  }
}
