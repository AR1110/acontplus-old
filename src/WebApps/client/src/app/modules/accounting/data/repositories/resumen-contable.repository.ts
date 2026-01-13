import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class ResumenContableRepository {
  abstract getDataFilter(): Observable<any>;
}
