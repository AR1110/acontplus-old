import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

export abstract class EmailQueueRepository {
  abstract send<T>(data: T): Observable<ApiResponse>;
}
