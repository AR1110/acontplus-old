import { inject, Injectable } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private readonly _url = `${PATHS_API.COMMON}${PATHS.APP_NOTIFICATION}`;

  private readonly _http = inject(HttpClient);

  post<T>(data: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url}?json=${JSON.stringify(data)}`, '');
  }
}
