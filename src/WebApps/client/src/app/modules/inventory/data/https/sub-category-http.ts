import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy, isApiResponse } from '@core/models/api-response-legacy';
import { map } from 'rxjs';

import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { SubCategoryRepository } from '@inventory/data/repositories/sub-category.repository';
import { SubCategoryMapper } from '@inventory/data/mappers/sub-category-mapper';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryHttp implements SubCategoryRepository {
  private http = inject(HttpClient);
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.SUBCATEGORY}`;

  getAll<T>(data: T) {
    const params = SubCategoryMapper.toJson(data);
    return this.http
      .get(`${this.url}?json=${params}`)
      .pipe(
        map((response) => {
          if (isApiResponse(response)) {
            if (response.code === '0') {
              throw response;
            }
            if (response.code === '1') {
              const subCategorias = JSON.parse(response.payload as string) ?? [];
              return SubCategoryMapper.fromApiResponseList(subCategorias);
            }
          }
          return [];
        }),
      );
  }

  post<T>(obj: T, file: Blob | string) {
    const json = JSON.stringify(obj);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponseLegacy>(`${this.url}?json=${json}`, formData);
  }

  put<T>(id: number, obj: T) {
    const json = JSON.stringify(obj);
    return this.http.put<ApiResponseLegacy>(`${this.url}${id}?json=${json}`, null);
  }

  updateStatus(id: number) {
    return this.http.delete<ApiResponseLegacy>(`${this.url}${id}`);
  }
}
