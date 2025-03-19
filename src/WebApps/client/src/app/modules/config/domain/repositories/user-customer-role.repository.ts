import { Observable } from 'rxjs';
import {
  UserCustomerDataForm,
  UserCustomerParamsUpdate,
} from "@modules/config/domain/models/user-customer/user-customer.model";
import {ApiResponse} from "@core/models/api-response";
import {UserCustomerRoleResponse} from "@modules/config/domain/models/user-customer/user-customer-role.model";

export abstract class UserCustomerRoleRepository {
  abstract list<T>(parameters: T): Observable<UserCustomerRoleResponse>;
    abstract create<T>(parameters: T): Observable<ApiResponse>;
   abstract update (parameters: UserCustomerParamsUpdate): Observable<ApiResponse>;
   abstract dataForm(): Observable<UserCustomerDataForm>
}
