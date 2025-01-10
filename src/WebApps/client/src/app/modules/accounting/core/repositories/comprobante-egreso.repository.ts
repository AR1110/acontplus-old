import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";

export abstract class ComprobanteEgresoRepository {
  abstract getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;

  abstract getDataFormPago(idProveedor: number): Observable<any>;

  abstract getDataFilter(): Observable<any>;

  abstract post<T>(obj: T): Observable<ApiResponse>;
}
