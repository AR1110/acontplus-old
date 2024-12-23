import { Observable } from 'rxjs';
import { UserManual } from '@modules/common/core/domain/user-manual.model';

export abstract class UserManualRepository {
  abstract get<T>(parameters: T): Observable<{
    modules: any[];
    userManuals: UserManual[];
  }>;
}
