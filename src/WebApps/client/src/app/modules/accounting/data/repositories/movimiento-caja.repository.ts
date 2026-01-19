import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { ListMovimientoCajaResponse } from '@accounting/data/models/movimiento-caja.model';

export abstract class MovimientoCajaRepository {
  abstract getAll<T>(obj: T): Observable<ListMovimientoCajaResponse>;
  abstract getDataFilter(): Observable<{ establecimientos: any[] }>;
  abstract getDataForm(): Observable<{
    cajas: any[];
    entidadesFinanciera: any[];
    establecimientos: any[];
    subEntidadesFinanciera: any[];
    tiposDocumento: any[];
  }>;
  // abstract getId(idCaja: number): Observable<{ caja-page:any, asignaciones: any[] }>
  abstract create<T>(data: T): Observable<ApiResponseLegacy>;
  abstract update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
}
