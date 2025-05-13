import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";
import {ListVehicleParams, ListVehicleResponse} from "@mechanical/domain/models/vehicle.model";

export abstract class VehicleRepository {
  abstract getAll(obj:ListVehicleParams): Observable<ListVehicleResponse>;

  abstract getDataForm():Observable<any>

  abstract getId(id: number, loader?: boolean):Observable<any>

  abstract  post<T>(data: T): Observable<ApiResponse>

  abstract  put<T>(id: number, data: T): Observable<ApiResponse>

  abstract remove(id: number): Observable<ApiResponse>

  abstract putState(id: number,state: boolean): Observable<ApiResponse>
}
