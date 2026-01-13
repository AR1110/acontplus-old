import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CategoryRepository } from '@accounting/data/repositories/category.repository';

@Injectable({
  providedIn: 'root',
})
export class CategoryHttp implements CategoryRepository {
  private http = inject(HttpClient);

  get<T>(params: T): Observable<any> {
    return this.http.post('/api/accounting/category/get', params);
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.http.delete<ApiResponseLegacy>(`/api/accounting/category/${id}`);
  }

  post<T>(data: T): Observable<ApiResponseLegacy> {
    return this.http.post<ApiResponseLegacy>('/api/accounting/category', data);
  }

  put<T>(id: number, data: T): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`/api/accounting/category/${id}`, data);
  }
}
