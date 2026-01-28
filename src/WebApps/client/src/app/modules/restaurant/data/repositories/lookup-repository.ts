import { Observable } from 'rxjs';
import { LookupType } from '@core/models/lookup-type';

export abstract class LookupRepository {
  abstract getLookups(params: { type: LookupType; keys: string }): Observable<any>;
}
