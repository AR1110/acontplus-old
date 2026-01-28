import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UserPermissionResponse } from '@modules/config/data/models/user/user-permission.model';
import { Observable } from 'rxjs';

export abstract class UserPermissionRepository {
  abstract list<T>(parameters: T): Observable<UserPermissionResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponseLegacy>;
  abstract update<T>(parameters: T): Observable<ApiResponseLegacy>;
}
