import { LookupType } from '@core/models/lookup-type';
import { Observable } from 'rxjs';

export abstract class LookUpRepository {
  abstract getLookup(params: { type: LookupType; keys: string }): Observable<any>;
}
