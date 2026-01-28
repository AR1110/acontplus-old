import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  UserRole,
  UserRoleAccessResponse,
  UserRoleResponse,
} from '@modules/config/data/models/user/user-role.model';
import { Observable } from 'rxjs';

export abstract class UserRoleRepository {
  abstract list<T>(parameters: T): Observable<UserRoleResponse>;
  abstract updateAccess(parameters: any): Observable<ApiResponseLegacy>;
  abstract listAccess(params: Partial<UserRole>): Observable<UserRoleAccessResponse>;
}
