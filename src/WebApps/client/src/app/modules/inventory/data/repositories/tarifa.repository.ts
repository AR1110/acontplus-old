import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface TarifaRepository {
  getAll<T>(obj: T): Observable<{ tarifas: any[] }>;
  put<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
