import { LookupType } from '@core/models/lookup-type';
import { Observable } from 'rxjs';
import { PurchaseLookupResponse } from '../models/purchase-lookup';

export abstract class LookUpRepository {
  abstract getLookup(params: LookupType): Observable<PurchaseLookupResponse>;
}
