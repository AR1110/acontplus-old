import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { TableRepository } from '@restaurant/domain/repositories/table.repository';

@Injectable({
  providedIn: 'root',
})
export class TableWebService implements TableRepository {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.TABLE}`;
  #http = inject(HttpClient);

  remove(id: number) {
    return this.#http.delete<ApiResponseLegacy>(`${this.#url}${id}`);
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, data);
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, data);
  }
}
