import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class PuntoEmisionService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.PUNTO_EMISION}`;
  #http = inject(HttpClient);

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, { data });
  }

  annul(id: number) {
    return this.#http.delete<ApiResponseLegacy>(`${this.#url}${id}`);
  }
}
