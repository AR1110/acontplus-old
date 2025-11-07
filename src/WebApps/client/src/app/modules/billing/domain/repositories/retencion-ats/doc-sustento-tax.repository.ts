import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class DocSustentoTaxRepository {
  abstract getById(id: number): Observable<ApiResponseLegacy>;
  abstract create<T>(data: T): Observable<ApiResponseLegacy>;
  abstract update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
}
