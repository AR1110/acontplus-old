import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class SubEntidadFinancieraRepository {
  abstract getAll(): Observable<{  entidadesFinancieras: any[],
    subEntidadesFinancieras: any[] }>;
    abstract create<T>(data: T): Observable<ApiResponse>;
    abstract update<T>(id: number, data: T): Observable<ApiResponse>;
    abstract delete(id: number): Observable<ApiResponse>;
}
