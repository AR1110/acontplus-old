import { inject, Injectable } from '@angular/core';
import { INVENTORY_PATHS } from '../enums/inventory.enum';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryPhotoService {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.SUBCATEGORY_PHOTO}`
  private http = inject(HttpClient)

  post(subcategoryId: number, file: Blob) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.url}${subcategoryId}`, formData)
  }

  put<T>(obj: T, id: number, file: Blob) {

    let json = JSON.stringify(obj)

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.url}Put/${id}?json=${json}`, formData)
  }
}
