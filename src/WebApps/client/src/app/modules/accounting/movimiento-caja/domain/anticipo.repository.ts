import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

export abstract class AnticipoRepository {
  abstract getAll<T>(obj: T): Observable<any[]>;
  abstract getDataForm(): Observable<{
    entidadesFinanciera: any[];
    establecimientos: any[];
    subEntidadesFinanciera: any[];
  }>;
  abstract getDataFilter(): Observable<{
    establecimientos: any[];
  }>;
  abstract create<T>(data: T): Observable<ApiResponse>;
  abstract update<T>(id: number, data: T): Observable<ApiResponse>;
  abstract delete(id: number): Observable<ApiResponse>;
}
