import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FilterDataSupportResponse } from '@mechanical/domain/models/support.model';

export abstract class SupportRepository {
  abstract getAll<T extends { pageIndex: number; pageSize: number }>(obj: T): Observable<any[]>;

  abstract getDataFilter(): Observable<FilterDataSupportResponse>;

  abstract getDataForm(): Observable<any>;

  abstract getId(id: number, loader?: boolean): Observable<any>;

  abstract getDashboard(): Observable<any>;

  abstract getConvertToAprobDoc(id: number, loader?: boolean): Observable<any>;

  abstract getDocView(id: number, loader?: boolean): Observable<any>;

  abstract generateSequential(idPuntoEmision: number): Observable<string>;

  abstract search<T extends { textSearch: string }>(obj: T): Observable<any>;

  abstract post<T>(data: T): Observable<ApiResponseLegacy>;

  abstract put<T>(id: number, data: T): Observable<ApiResponseLegacy>;

  abstract remove(id: number): Observable<ApiResponseLegacy>;

  abstract putState(id: number, supportStatusId: number): Observable<ApiResponseLegacy>;
}
