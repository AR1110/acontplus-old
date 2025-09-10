import { ListShiftResponse, ShiftList } from '@modules/config/domain/models/shift.models';
import { ShiftRepository } from '@modules/config/domain/repositories/shift.repository';
import { ApiResponse } from '@core/models/api-response';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShiftUseCase {
  private readonly shiftRepository = inject(ShiftRepository);

  listShifts(params: any): Observable<ListShiftResponse> {
    return this.shiftRepository.list(params);
  }

  createShift(params: ShiftList): Observable<ApiResponse> {
    return this.shiftRepository.create(params);
  }

  updateShift(params: ShiftList): Observable<ApiResponse> {
    return this.shiftRepository.update(params);
  }

  deleteShift(params: Partial<ShiftList>): Observable<ApiResponse> {
    return this.shiftRepository.delete(params);
  }
}
