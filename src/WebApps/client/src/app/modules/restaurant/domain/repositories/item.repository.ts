import { Observable } from 'rxjs';

export abstract class ItemRepository {
  abstract list(params: any): Observable<any>;
}
