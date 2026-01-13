import { CONFIG_PATHS } from '@modules/config/config-const';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyDemoStepService {
  private readonly http = inject(HttpClient);
  private readonly url = `${PATHS_API.CONFIG}${CONFIG_PATHS.COMPANY_DEMO_STEP}`;

  get() {
    return this.http.get<ApiResponseLegacy>(`${this.url}`).pipe(map((response) => response));
  }

  post(id: number) {
    return this.http
      .post<ApiResponseLegacy>(`${this.url}${id}`, null)
      .pipe(map((response) => response));
  }
}
