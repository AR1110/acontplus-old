import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductionAreaService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PRODUCTION_AREA}`;
  #http = inject(HttpClient);

  delete(id: number) {
    return this.#http
      .delete<ApiResponseLegacy>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }

  getByEstab(idEstablecimiento: number) {
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}GetByEstab/${idEstablecimiento}`)
      .pipe(map((response) => response));
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponseLegacy>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponseLegacy>(`${this.#url}${id}`, data)
      .pipe(map((response) => response));
  }
}
