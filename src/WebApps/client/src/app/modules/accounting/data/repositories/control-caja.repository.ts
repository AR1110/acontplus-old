import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  ArqueoControlCajaResponse,
  FilterDataControlCajaResponse,
  ListControlCajaResponse,
} from '@accounting/data/models/control-caja.entity';

export interface ControlCajaRepository {
  getAll<T>(obj: T): Observable<ListControlCajaResponse>;
  getDataForm(): Observable<any>;
  getDataFilter(): Observable<FilterDataControlCajaResponse>;
  post<T>(data: T): Observable<ApiResponseLegacy>;
  getArqueoCaja(id: number): Observable<ArqueoControlCajaResponse>;
  getDataFormCashboxClose(): Observable<any>;
  put<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
