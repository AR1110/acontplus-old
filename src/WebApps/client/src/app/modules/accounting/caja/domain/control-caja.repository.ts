import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';
import {
  ArqueoControlCajaResponse,
  FilterDataControlCajaResponse,
  ListControlCajaResponse,
} from '@accounting/caja/domain/control-caja.entity';

export abstract class ControlCajaRepository {
  abstract getAll<T>(obj: T): Observable<ListControlCajaResponse>;
  abstract getDataForm(): Observable<any>;

  abstract getDataFilter(): Observable<FilterDataControlCajaResponse>;
  abstract post<T>(data: T): Observable<ApiResponse>;
  abstract getArqueoCaja(id: number): Observable<ArqueoControlCajaResponse>;
  abstract getDataFormCashboxClose(): Observable<any>;
  abstract put<T>(id: number, data: T): Observable<ApiResponse>;
}
