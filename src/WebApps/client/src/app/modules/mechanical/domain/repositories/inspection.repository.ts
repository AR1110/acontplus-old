import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract  class InspectionRepository{

  abstract getAll<T extends { pageIndex: number; pageSize: number }>(obj:T): Observable<any[]>;

  abstract getDataForm(supportId: number):Observable<any>

  abstract getId(id: number, loader?: boolean):Observable<any>

  abstract  post<T>(data: T): Observable<ApiResponse>

  abstract  put<T>(id: number, data: T): Observable<ApiResponse>

  abstract remove(id: number): Observable<ApiResponse>

}
