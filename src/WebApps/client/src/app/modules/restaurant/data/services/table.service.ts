import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.TABLE}`;
  #http = inject(HttpClient);

  delete(id: number) {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
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
