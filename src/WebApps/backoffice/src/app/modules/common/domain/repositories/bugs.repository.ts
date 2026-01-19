import {Observable} from "rxjs";
import {BugsResponse} from "@modules/common/domain/models/bugs.model";


export abstract class BugsRepository {
  abstract list<T>(parameters: T): Observable<BugsResponse>;

}
