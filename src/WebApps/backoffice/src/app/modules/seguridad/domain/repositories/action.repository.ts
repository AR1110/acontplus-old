import {Observable} from "rxjs";
import {ApiResponse} from "acontplus-utils";
import {ActionResponse} from "@modules/seguridad/domain/models/action.model";


export abstract class ActionRepository {
  abstract list<T>(parameters: T): Observable<ActionResponse>;
  abstract create(data: Partial<any>): Observable<ApiResponse>;
   abstract update(data: any): Observable<ApiResponse>;
    abstract updateStatus(id: number): Observable<ApiResponse>;
}
