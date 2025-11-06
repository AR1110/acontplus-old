import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class ProductUbicationRepository {
  abstract post<T>(obj: T, file?: Blob): Observable<ApiResponseLegacy>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
  abstract remove(id: number): Observable<ApiResponseLegacy>;
}
