import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

export abstract class ResumenContableRepository {
  abstract getDataFilter(): Observable<any>;
}
