import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListVehicleParams, ListVehicleResponse } from '@mechanical/domain/models/vehicle.model';

export abstract class VehicleRepository {
  abstract getAll(obj: ListVehicleParams): Observable<ListVehicleResponse>;

  abstract getDataForm(): Observable<any>;

  abstract getId(id: number, loader?: boolean): Observable<any>;

  abstract post<T>(data: T): Observable<ApiResponseLegacy>;

  abstract put<T>(id: number, data: T): Observable<ApiResponseLegacy>;

  abstract remove(id: number): Observable<ApiResponseLegacy>;

  abstract putState(id: number, state: boolean): Observable<ApiResponseLegacy>;
}
