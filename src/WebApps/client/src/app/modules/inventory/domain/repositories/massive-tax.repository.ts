import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

export abstract class MassiveTaxRepository {
  abstract getAll<T>(obj: T): Observable<any>;
  abstract getDataForm(): Observable<any>;
  abstract put<T>(obj: T): Observable<ApiResponse>;
  abstract getQuantityProductByTaxId<T>(obj: T): Observable<any>;
}
