import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import {TableRepository} from "@restaurant/domain/repositories/table.repository";

@Injectable({
  providedIn: 'root',
})
export class TableWebService implements TableRepository{
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.TABLE}`;
  #http = inject(HttpClient);

  remove(id: number) {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponse>(`${this.#url}`, data)
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponse>(`${this.#url}${id}`, data)
  }
}
