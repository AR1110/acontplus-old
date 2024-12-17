import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class ControlCajaRepository {
  abstract getAll<T>(obj:T): Observable<any>;
  abstract getDataForm (): Observable<any>;

  abstract getDataFilter(): Observable<{

    estados:any[],
  }>
    abstract post<T>(data: T): Observable<ApiResponse>;
      abstract getArqueoCaja (id: number ): Observable<any>;
      abstract getDataFormCashboxClose():Observable<any>
    abstract put<T>(id: number, data: T): Observable<ApiResponse>;
}
