import { ListShiftResponse, ShiftList } from '@modules/config/data/models/shift.models';
import { ShiftRepository } from '@modules/config/data/repositories/shift.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
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

  createShift(params: ShiftList): Observable<ApiResponseLegacy> {
    return this.shiftRepository.create(params);
  }

  updateShift(params: ShiftList): Observable<ApiResponseLegacy> {
    return this.shiftRepository.update(params);
  }

  deleteShift(params: Partial<ShiftList>): Observable<ApiResponseLegacy> {
    return this.shiftRepository.delete(params);
  }
}
