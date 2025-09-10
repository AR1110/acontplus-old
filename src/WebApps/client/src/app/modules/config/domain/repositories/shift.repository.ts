import { ListShiftResponse, ShiftList } from '@modules/config/domain/models/shift.models';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

export abstract class ShiftRepository {
  abstract list(params: any): Observable<ListShiftResponse>;
  abstract create(params: any): Observable<ApiResponse>;
  abstract update(params: any): Observable<ApiResponse>;
  abstract delete(params: Partial<ShiftList>): Observable<ApiResponse>;
}
