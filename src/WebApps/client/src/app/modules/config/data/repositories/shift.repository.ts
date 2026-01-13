import { ListShiftResponse, ShiftList } from '@modules/config/data/models/shift.models';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class ShiftRepository {
  abstract list(params: any): Observable<ListShiftResponse>;
  abstract create(params: ShiftList): Observable<ApiResponseLegacy>;
  abstract update(params: ShiftList): Observable<ApiResponseLegacy>;
  abstract delete(params: Partial<ShiftList>): Observable<ApiResponseLegacy>;
}
