import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import {
  UserCustomerRole,
  UserCustomerRoleAccessResponse,
  UserCustomerRoleResponse,
} from '@modules/config/domain/models/user-customer/user-customer-role.model';

export abstract class UserCustomerRoleRepository {
  abstract list<T>(parameters: T): Observable<UserCustomerRoleResponse>;
  abstract updateAccess(parameters: any): Observable<ApiResponse>;
  abstract listAccess(
    params: Partial<UserCustomerRole>,
  ): Observable<UserCustomerRoleAccessResponse>;
}
