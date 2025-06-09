import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class CajaRepository {
  abstract getAll<T>(obj:T): Observable<any[]>;
  abstract getDataForm(): Observable<any>
  abstract getId(idCaja: number): Observable<{ caja:any, asignaciones: any[] }>
    abstract create<T>(data: T): Observable<ApiResponse>;
    abstract update<T>(id: number, data: T): Observable<ApiResponse>;
    abstract delete(id: number): Observable<ApiResponse>;
}
