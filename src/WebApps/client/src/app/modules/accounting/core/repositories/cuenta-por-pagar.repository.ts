import { Observable } from "rxjs";
import {ApiResponse} from "@core/models/api-response";

export abstract class CuentaPorPagarRepository {
  abstract getDataFilter(): Observable<any>;
  abstract getAll<T>(obj:T): Observable<any>;
  abstract getCuotasData(): Observable<any>;
  abstract getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;
  abstract getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;
  abstract generarCuotas<T>(obj:T): Observable<ApiResponse>;
  abstract actualizarCuotas<T>(id: number, obj: T): Observable<ApiResponse>;
}
