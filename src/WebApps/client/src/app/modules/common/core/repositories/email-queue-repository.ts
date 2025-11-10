import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class EmailQueueRepository {
  abstract send<T>(data: T): Observable<ApiResponseLegacy>;
}
