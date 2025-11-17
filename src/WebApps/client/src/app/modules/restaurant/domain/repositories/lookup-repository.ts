import {Observable} from "rxjs";

export abstract class LookupRepository {
  abstract getLookup(lookupType: string): Observable<any>;
}
