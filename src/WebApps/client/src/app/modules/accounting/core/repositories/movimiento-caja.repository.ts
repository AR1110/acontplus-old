import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class MovimientoCajaRepository {
    abstract getAll<T>(obj:T): Observable<any[]>;
  abstract getDataFilter(): Observable<{ establecimientos: any[] }>
  abstract getDataForm(): Observable<{
    cajas: any[],
    entidadesFinanciera:any[],
    establecimientos:any[],
    subEntidadesFinanciera:any[],
    tiposDocumento: any[]
  }>
    // abstract getId(idCaja: number): Observable<{ caja:any, asignaciones: any[] }>
    abstract create<T>(data: T): Observable<ApiResponse>;
    abstract update<T>(id: number, data: T): Observable<ApiResponse>;
    abstract delete(id: number): Observable<ApiResponse>;
}
