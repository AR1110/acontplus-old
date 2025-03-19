import { Observable } from 'rxjs';
import {
  UserCustomerDataForm,
  UserCustomerParamsUpdate,
} from "@modules/config/domain/models/user-customer/user-customer.model";
import {ApiResponse} from "@core/models/api-response";
import {AsignacionEstabResponse} from "@modules/config/domain/models/user-customer/asignacion-estab.model";

export abstract class AsignacionEstabRepository {
  abstract list<T>(parameters: T): Observable<AsignacionEstabResponse>;
    abstract create<T>(parameters: T): Observable<ApiResponse>;
   abstract update (parameters: UserCustomerParamsUpdate): Observable<ApiResponse>;
   abstract dataForm(): Observable<UserCustomerDataForm>
}
