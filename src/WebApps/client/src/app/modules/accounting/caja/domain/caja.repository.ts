import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";
import {GetIdCajaResponse, ListCajaResponse} from "@accounting/caja/domain/caja.entity";

export abstract class CajaRepository {
  abstract getAll<T>(obj:T): Observable<ListCajaResponse>;
  abstract getDataForm(): Observable<any>
  abstract getId(idCaja: number): Observable<GetIdCajaResponse>
    abstract create<T>(data: T): Observable<ApiResponse>;
    abstract update<T>(id: number, data: T): Observable<ApiResponse>;
    abstract delete(id: number): Observable<ApiResponse>;
}
