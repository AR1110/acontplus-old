import { ScheduleRepository } from '@modules/config/data/repositories/schedule.repository';
import { ListScheduleResponse } from '@modules/config/data/models/schedule.model';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { PATHS_API } from '@core/constants/global.constants';
import { ScheduleMapper } from './list-schedule.mapper';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class ScheduleRepositoryImpl implements ScheduleRepository {
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.SCHEDULE}`;
  private _http = inject(HttpClient);

  list(): Observable<ListScheduleResponse> {
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`)
      .pipe(map((response) => ScheduleMapper.fromJson(response)));
  }
}
