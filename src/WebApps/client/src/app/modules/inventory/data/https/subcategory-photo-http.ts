import { inject, Injectable } from '@angular/core';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SubcategoryPhotoRepository } from '@inventory/data/repositories/subcategory-photo.repository';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryPhotoHttp implements SubcategoryPhotoRepository {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.SUBCATEGORY_PHOTO}`;
  private http = inject(HttpClient);

  post(subcategoryId: number, file: Blob) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponseLegacy>(`${this.url}${subcategoryId}`, formData);
  }

  put<T>(obj: T, id: number, file: Blob) {
    const json = JSON.stringify(obj);

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponseLegacy>(`${this.url}Put/${id}?json=${json}`, formData);
  }
}
