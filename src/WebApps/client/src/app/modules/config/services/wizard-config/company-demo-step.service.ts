import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/enums/config.enums';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyDemoStepService {
  #http = inject(HttpClient);
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.COMPANY_DEMO_STEP}`;

  get<T>(params: T) {
    return this.#http
      .get<ApiResponse>(`${this.#url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }

  post(id: number) {
    return this.#http
      .post<ApiResponse>(`${this.#url}${id}`, null)
      .pipe(map((response) => response));
  }
}
