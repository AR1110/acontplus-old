import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { ProductBarcodeRepository } from '@inventory/domain/interfaces/product-barcode.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductBarcodeHttp implements ProductBarcodeRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_BARCODE}`;
  private _http = inject(HttpClient);

  post<T>(obj: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url} `, { data: obj });
  }
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(`${this._url}/${id} `, { data: obj });
  }
  remove(id: number): Observable<ApiResponseLegacy> {
    return this._http.delete<ApiResponseLegacy>(`${this._url}/${id}`);
  }
}
