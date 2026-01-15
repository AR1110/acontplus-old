import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class TableRepository {
  abstract remove(id: number): Observable<ApiResponseLegacy>;

  abstract post<T>(obj: T): Observable<ApiResponseLegacy>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
}
