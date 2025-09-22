import { ScheduleRepository } from '@modules/config/domain/repositories/schedule.repository';
import { ListScheduleResponse } from '@modules/config/domain/models/schedule.model';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse } from '@core/models/api-response';
import { ScheduleMapper } from './list-schedule.mapper';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleRepositoryImpl implements ScheduleRepository {
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.SCHEDULE}`;
  private _http = inject(HttpClient);

  list(): Observable<ListScheduleResponse> {
    return this._http
      .get<ApiResponse>(`${this._url}`)
      .pipe(map((response) => ScheduleMapper.fromJson(response)));
  }
}
