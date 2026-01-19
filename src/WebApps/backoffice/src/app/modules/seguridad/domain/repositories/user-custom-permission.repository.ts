import {Observable} from "rxjs";
import {
  UserCustomPermissionDataForm,
  UserCustomPermissionResponse
} from "@modules/seguridad/domain/models/user-custom-permission.model";
import {ApiResponse} from "acontplus-utils";


export abstract class UserCustomPermissionRepository {
  abstract getFormData(): Observable<UserCustomPermissionDataForm>;
  abstract list<T>(parameters: T): Observable<UserCustomPermissionResponse>;
  // abstract getById(id: number): Observable<any>;
  abstract create(data: Partial<any>): Observable<ApiResponse>;
   abstract update(data: any): Observable<ApiResponse>;
  // abstract delete(id: number): Observable<void>;
}
