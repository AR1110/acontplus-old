import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class MassiveTaxRepository {
  abstract getAll<T>(obj: T): Observable<any>;
  abstract getDataForm(): Observable<any>;
  abstract put<T>(obj: T): Observable<ApiResponseLegacy>;
  abstract getQuantityProductByTaxId<T>(obj: T): Observable<any>;
}
