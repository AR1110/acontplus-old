import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class SubEntidadFinancieraRepository {
  abstract getAll(): Observable<{ entidadesFinancieras: any[]; subEntidadesFinancieras: any[] }>;
  abstract create<T>(data: T): Observable<ApiResponseLegacy>;
  abstract update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
}
