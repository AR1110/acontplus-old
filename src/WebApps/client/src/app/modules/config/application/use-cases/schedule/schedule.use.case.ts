import { ScheduleRepository } from '@modules/config/data/repositories/schedule.repository';
import { ListScheduleResponse } from '@modules/config/data/models/schedule.model';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleUseCase {
  private readonly shiftRepository = inject(ScheduleRepository);

  listSchedules(): Observable<ListScheduleResponse> {
    return this.shiftRepository.list();
  }
}
