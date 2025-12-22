import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface MeasureRepository {
  getAll<T>(obj: T): Observable<any>;
  post<T>(obj: T): Observable<ApiResponseLegacy>;
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
  updateStatus(id: number): Observable<ApiResponseLegacy>;
}
