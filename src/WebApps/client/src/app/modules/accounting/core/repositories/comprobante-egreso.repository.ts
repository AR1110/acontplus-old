import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";
import {
  ComprobanteEgresoFilterResponse,
  ComprobanteEgresoResponse
} from "@accounting/core/models/comprobante-egreso.model";

export abstract class ComprobanteEgresoRepository {

  abstract list(params:any):Observable<ComprobanteEgresoResponse>
  abstract dataFilter(): Observable<ComprobanteEgresoFilterResponse>

  abstract getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;

  abstract getDataFormPago(idProveedor: number): Observable<any>;

  abstract getDataFilter(): Observable<any>;

  abstract post<T>(obj: T): Observable<ApiResponse>;
}
