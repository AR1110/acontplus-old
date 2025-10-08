import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { UserCustomerPermissionResponse } from '@modules/config/domain/models/user-customer/user-customer-permission.model';

export abstract class UserCustomerPermissionRepository {
  abstract list<T>(parameters: T): Observable<UserCustomerPermissionResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponse>;
  abstract update<T>(parameters: T): Observable<ApiResponse>;
}
