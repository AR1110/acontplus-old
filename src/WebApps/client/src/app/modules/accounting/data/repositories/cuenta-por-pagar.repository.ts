import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FilterDataCuentaPorPagarResponse } from '@accounting/data/models/cuenta-por-pagar.model';

export abstract class CuentaPorPagarRepository {
  abstract getDataFilter(): Observable<FilterDataCuentaPorPagarResponse>;
  abstract getAll<T>(obj: T): Observable<any>;
  abstract getCuotasData(): Observable<any>;
  abstract getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;
  abstract getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar: number): Observable<any>;
  abstract generarCuotas<T>(obj: T): Observable<ApiResponseLegacy>;
  abstract actualizarCuotas<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
}
