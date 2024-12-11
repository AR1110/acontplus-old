import { Observable } from "rxjs";

export abstract class CuentaPorPagarRepository {
  abstract getDataFilter(): Observable<any>;
  abstract getAll<T>(obj:T): Observable<any>;
  abstract getCuotasData(): Observable<any>;
  abstract getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;
  abstract getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;
  abstract generarCuota<T>(obj:T): Observable<any>;
  abstract actualizarCuotas<T>(id: number, obj: T): Observable<any[]>;
}
