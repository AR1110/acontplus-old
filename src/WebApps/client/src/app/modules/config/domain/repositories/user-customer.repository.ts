import {
  UserCustomer,
  UserCustomerDataForm,
  UserCustomerResponse,
} from '@modules/config/domain/models/user-customer/user-customer.model';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

export abstract class UserCustomerRepository {
  abstract list<T>(parameters: T): Observable<UserCustomerResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponse>;
  abstract update(parameters: UserCustomer): Observable<ApiResponse>;
  abstract dataForm(): Observable<UserCustomerDataForm>;
}
