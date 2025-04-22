import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";
import {SeatCreateDto, SeatUpdateParams} from "@barber-shop/domain/models/seat.model";

export abstract class SeatRepository {
  abstract list():Observable<any>;
  abstract create(params: SeatCreateDto): Observable<ApiResponse>;
  abstract update(params: SeatUpdateParams): Observable<ApiResponse>;
  // abstract remove(): Observable<ApiResponse>;

}
