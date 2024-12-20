import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";

export abstract class VehicleRepository {
  abstract getAll<T extends { pageIndex: number; pageSize: number }>(obj:T): Observable<any[]>;

  abstract getDataForm():Observable<any>

  abstract getId(id: number, loader?: boolean):Observable<any>

  abstract  post<T>(data: T): Observable<ApiResponse>

  abstract  put<T>(id: number, data: T): Observable<ApiResponse>

  abstract remove(id: number): Observable<ApiResponse>

  abstract putState(id: number,state: boolean): Observable<ApiResponse>
}
