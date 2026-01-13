import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SubCategoryRepository } from '@accounting/data/repositories/sub-category.repository';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryHttp extends SubCategoryRepository {
  private http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any[]> {
    return this.http.post<any[]>('/api/accounting/sub-category/get-all', obj);
  }

  getDataForm(): Observable<{ categories: any[] }> {
    return this.http.get<{ categories: any[] }>('/api/accounting/sub-category/data-form');
  }

  create<T>(data: T): Observable<ApiResponseLegacy> {
    return this.http.post<ApiResponseLegacy>('/api/accounting/sub-category', data);
  }

  update<T>(id: number, data: T): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`/api/accounting/sub-category/${id}`, data);
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.http.delete<ApiResponseLegacy>(`/api/accounting/sub-category/${id}`);
  }
}
