import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface LotPriceRepository {
  getDataFilter(): Observable<any>;
  getAll<T>(obj: T): Observable<unknown[]>;
  put<T>(data: T): Observable<ApiResponseLegacy>;
}
