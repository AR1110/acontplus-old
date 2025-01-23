import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";

export abstract  class SupportRepository{
  abstract getAll<T extends { pageIndex: number; pageSize: number }>(obj:T): Observable<any[]>;

  abstract getDataFilter():Observable<{ supportStatus: any[]  }>

  abstract getDataForm():Observable<any>

  abstract getId(id: number, loader?: boolean):Observable<any>

  abstract getDashboard():Observable<any>

  abstract getConvertToAprobDoc(id: number, loader?: boolean):Observable<any>

  abstract getDocView(id: number, loader?: boolean):Observable<any>

  abstract search<T extends { textSearch: string }>(obj: T): Observable<any>

  abstract  post<T>(data: T): Observable<ApiResponse>

  abstract  put<T>(id: number, data: T): Observable<ApiResponse>

  abstract remove(id: number): Observable<ApiResponse>

  abstract putState(id: number, supportStatusId: number): Observable<ApiResponse>
}
