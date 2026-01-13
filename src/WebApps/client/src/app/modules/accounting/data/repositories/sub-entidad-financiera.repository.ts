import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export interface SubEntidadFinancieraRepository {
  getAll(): Observable<{ entidadesFinancieras: any[]; subEntidadesFinancieras: any[] }>;
  create<T>(data: T): Observable<ApiResponseLegacy>;
  update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
  delete(id: number): Observable<ApiResponseLegacy>;
}
