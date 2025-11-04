import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.STATS}`;
  get<T>(parameters: T) {
    return this.http
      .get(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }
}
