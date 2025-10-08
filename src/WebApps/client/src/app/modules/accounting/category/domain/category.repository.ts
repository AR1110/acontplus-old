import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

export abstract class CategoryRepository {
  abstract get<T>(params: T): Observable<any>;
  abstract delete(id: number): Observable<ApiResponse>;
  abstract post<T>(data: T): Observable<ApiResponse>;
  abstract put<T>(id: number, data: T): Observable<ApiResponse>;
}
