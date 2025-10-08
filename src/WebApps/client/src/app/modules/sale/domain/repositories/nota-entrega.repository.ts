import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

export abstract class NotaEntregaRepository {
  abstract getDataFilter(): Observable<any>;

  abstract getAll<T>(obj: T): Observable<any>;

  abstract getDetalleCompleto(id: number): Observable<any>;
  abstract post<T>(obj: T): Observable<ApiResponse>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponse>;
}
