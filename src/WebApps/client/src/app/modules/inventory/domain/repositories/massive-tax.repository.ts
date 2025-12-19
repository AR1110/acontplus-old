import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface MassiveTaxRepository {
  getAll<T>(obj: T): Observable<any>;
  getDataForm(): Observable<any>;
  put<T>(obj: T): Observable<ApiResponseLegacy>;
  getQuantityProductByTaxId<T>(obj: T): Observable<any>;
}
