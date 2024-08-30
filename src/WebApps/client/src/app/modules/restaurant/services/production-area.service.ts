import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductionAreaService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PRODUCTION_AREA}`;
  #http = inject(HttpClient);

  delete(id: number) {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }

  getByEstab(idEstablecimiento: number) {
    return this.#http
      .get<ApiResponse>(`${this.#url}GetByEstab/${idEstablecimiento}`)
      .pipe(map((response) => response));
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponse>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponse>(`${this.#url}${id}`, data)
      .pipe(map((response) => response));
  }
}
