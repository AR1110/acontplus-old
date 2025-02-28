import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';
import {RoomRepository} from "@restaurant/domain/repositories/room.repository";

@Injectable({
  providedIn: 'root',
})
export class RoomWebService implements RoomRepository{
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.ROOM}`;
  #http = inject(HttpClient);

  get<T>(params: T) {
    return this.#http
      .get<ApiResponse>(`${this.#url}?json=${JSON.stringify({ params })}`)
      .pipe(map((response) => response));
  }

  getByEstab(establecimientoId: number) {
    return this.#http
      .get<ApiResponse>(`${this.#url}GetByEstab/${establecimientoId}`)
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

  remove(id: number) {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }
}
