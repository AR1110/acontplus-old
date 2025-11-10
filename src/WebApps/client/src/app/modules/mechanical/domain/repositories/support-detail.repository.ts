import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class SupportDetailRepository {
  abstract getId(id: number, loader?: boolean): Observable<any>;

  abstract post<T>(data: T): Observable<ApiResponseLegacy>;
}
