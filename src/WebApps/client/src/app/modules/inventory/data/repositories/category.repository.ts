import { Observable } from 'rxjs';

export interface CategoryRepository {
  getAll<T>(data: T): Observable<any[]>;
}
