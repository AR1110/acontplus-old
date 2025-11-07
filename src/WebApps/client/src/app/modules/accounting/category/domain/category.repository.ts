import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class CategoryRepository {
  abstract get<T>(params: T): Observable<any>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
  abstract post<T>(data: T): Observable<ApiResponseLegacy>;
  abstract put<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
