import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  UserCustomerRole,
  UserCustomerRoleAccessResponse,
  UserCustomerRoleResponse,
} from '@modules/config/data/models/user-customer/user-customer-role.model';

export abstract class UserCustomerRoleRepository {
  abstract list<T>(parameters: T): Observable<UserCustomerRoleResponse>;
  abstract updateAccess(parameters: any): Observable<ApiResponseLegacy>;
  abstract listAccess(
    params: Partial<UserCustomerRole>,
  ): Observable<UserCustomerRoleAccessResponse>;
}
