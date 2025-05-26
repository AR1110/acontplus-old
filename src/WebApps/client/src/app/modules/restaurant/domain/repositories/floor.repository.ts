import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";
import {GetFloorsByEstabIdResponse} from "@restaurant/domain/models/floor.model";

export abstract  class FloorRepository{


  abstract remove(id:number): Observable<ApiResponse>

  abstract post<T>(obj:T): Observable<ApiResponse>;
  abstract put<T>(id:number, obj:T): Observable<ApiResponse>;


  abstract getByEstablishmentId(establishmentId: number): Observable<GetFloorsByEstabIdResponse>;
  abstract deleteById(id: number): Observable<ApiResponse>;
  abstract create<T>(data: T): Observable<ApiResponse>;
  abstract update<T>(id: number, data: T): Observable<ApiResponse>;

}
