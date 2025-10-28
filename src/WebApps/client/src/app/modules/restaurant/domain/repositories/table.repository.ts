import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

export abstract class TableRepository {
  abstract remove(id: number): Observable<ApiResponse>;

  abstract post<T>(obj: T): Observable<ApiResponse>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponse>;
}
