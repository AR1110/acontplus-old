import { Observable } from 'rxjs';

export interface BaseUseCase<T, P> {
  execute(params: P): Observable<T>;
}
