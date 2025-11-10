import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CategoryRepository } from '@accounting/category/domain/category.repository';

@Injectable({
  providedIn: 'root',
})
export class CategoryWebRepository extends CategoryRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CATEGORY}`;
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  get<T>(params: T) {
    return this._http.get(`${this._url}?json=${JSON.stringify(params)}`);
  }

  delete(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }

  post<T>(data: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, data);
  }

  put<T>(id: number, data: T) {
    return this._http.put<ApiResponseLegacy>(`${this._url}${id}`, data);
  }
}
