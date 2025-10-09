import { Observable } from 'rxjs';

export abstract class DashboardRepository {
  abstract list<T>(parameters: T): Observable<any>
}
