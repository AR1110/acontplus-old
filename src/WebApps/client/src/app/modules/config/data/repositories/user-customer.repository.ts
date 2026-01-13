import {
  UserCustomer,
  UserCustomerDataForm,
  UserCustomerResponse,
} from '@modules/config/data/models/user-customer/user-customer.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class UserCustomerRepository {
  abstract list<T>(parameters: T): Observable<UserCustomerResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponseLegacy>;
  abstract update(parameters: UserCustomer): Observable<ApiResponseLegacy>;
  abstract dataForm(): Observable<UserCustomerDataForm>;
}
