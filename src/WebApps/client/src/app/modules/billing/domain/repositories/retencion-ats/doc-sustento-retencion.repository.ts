import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

export abstract class DocSustentoRetencionRepository {
  abstract getById(id: number): Observable<ApiResponse>;
  abstract create<T>(data: T): Observable<ApiResponse>;
  abstract update<T>(id: number, data: T): Observable<ApiResponse>;
  abstract delete(id: number): Observable<ApiResponse>;
}
