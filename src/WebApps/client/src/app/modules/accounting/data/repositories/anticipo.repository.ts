import { ApiResponseLegacy } from '@core/models/api-response-legacy';
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
  abstract create<T>(data: T): Observable<ApiResponseLegacy>;
  abstract update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
}
