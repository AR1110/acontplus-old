import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class ComprobanteIngresoRepository {
  abstract getAll<T>(obj:T): Observable<{data: any[]}>;
  abstract getDataFilter(): Observable<any>
   abstract create<T>(data: T): Observable<ApiResponse>;
  // abstract update<T>(id: number, data: T): Observable<ApiResponse>;
  // abstract delete(id: number): Observable<ApiResponse>;
}
