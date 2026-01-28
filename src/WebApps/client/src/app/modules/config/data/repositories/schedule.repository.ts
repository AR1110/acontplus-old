import { ListScheduleResponse } from '../models/schedule.model';
import { Observable } from 'rxjs';

export abstract class ScheduleRepository {
  abstract list(): Observable<ListScheduleResponse>;
}
