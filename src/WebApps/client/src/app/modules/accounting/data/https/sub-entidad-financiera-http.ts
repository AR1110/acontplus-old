import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SubEntidadFinancieraRepository } from '@accounting/data/repositories/sub-entidad-financiera.repository';

@Injectable({
  providedIn: 'root',
})
export class SubEntidadFinancieraHttp implements SubEntidadFinancieraRepository {
  private http = inject(HttpClient);

  getAll(): Observable<{ entidadesFinancieras: any[]; subEntidadesFinancieras: any[] }> {
    return this.http.get<{ entidadesFinancieras: any[]; subEntidadesFinancieras: any[] }>(
      '/api/accounting/sub-entidad-financiera',
    );
  }

  create<T>(data: T): Observable<ApiResponseLegacy> {
    return this.http.post<ApiResponseLegacy>('/api/accounting/sub-entidad-financiera', data);
  }

  update<T>(id: number, data: T): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`/api/accounting/sub-entidad-financiera/${id}`, data);
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.http.delete<ApiResponseLegacy>(`/api/accounting/sub-entidad-financiera/${id}`);
  }
}
