import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class CustomerRepository {
  abstract getAll<T>(obj: T): Observable<any[]>;
}
