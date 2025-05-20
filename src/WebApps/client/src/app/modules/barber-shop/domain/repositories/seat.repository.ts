import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";
import {SeatCreateDto, SeatResponse, SeatUpdateParams} from "@barber-shop/domain/models/seat.model";

export abstract class SeatRepository {
  abstract list():Observable<SeatResponse>;
  abstract create(params: SeatCreateDto): Observable<ApiResponse>;
  abstract update(params: SeatUpdateParams): Observable<ApiResponse>;
  // abstract remove(): Observable<ApiResponse>;

}
