import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  SeatCreateDto,
  SeatResponse,
  SeatUpdateParams,
} from '@barber-shop/domain/models/seat.model';

export abstract class SeatRepository {
  abstract list(): Observable<SeatResponse>;
  abstract create(params: SeatCreateDto): Observable<ApiResponseLegacy>;
  abstract update(params: SeatUpdateParams): Observable<ApiResponseLegacy>;
  // abstract remove(): Observable<ApiResponseLegacy>;
}
