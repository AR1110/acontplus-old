import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { GetIdCajaResponse, ListCajaResponse } from '@accounting/data/models/caja';

export interface CajaRepository {
   getAll<T>(obj: T): Observable<ListCajaResponse>;
   getDataForm(): Observable<any>;
   getId(idCaja: number): Observable<GetIdCajaResponse>;
   create<T>(data: T): Observable<ApiResponseLegacy>;
   update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
   delete(id: number): Observable<ApiResponseLegacy>;
}
