
import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";


export abstract class FractionalProductRepository {
  abstract getAll<T>(obj:T): Observable<any>
  // abstract getDataForm ( ): Observable<ApiResponse>
  // abstract post<T>(obj:T, file?:Blob): Observable<ApiResponse>;
  // abstract put<T>(id:number, obj:T): Observable<ApiResponse>;
  // abstract getId(id:number): Observable<ApiResponse>;
}
