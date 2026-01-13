import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UserCustomerPermissionResponse } from '@modules/config/data/models/user-customer/user-customer-permission.model';

export abstract class UserCustomerPermissionRepository {
  abstract list<T>(parameters: T): Observable<UserCustomerPermissionResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponseLegacy>;
  abstract update<T>(parameters: T): Observable<ApiResponseLegacy>;
}
