import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { API_ENDPOINTS } from '@modules/common/constants/common.constants';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManualService {
  #http = inject(HttpClient);
  #url = `${PATHS_API.COMMON}${API_ENDPOINTS.USER_MANUAL}`;

  get() {
    return this.#http
      .get<ApiResponse>(`${this.#url}`)
      .pipe(map((response) => response));
  }
}
