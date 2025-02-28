import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import {FloorRepository} from "@restaurant/domain/repositories/floor.repository";
import {RESTAURANT_PATHS} from "@restaurant/domain/enums/restaurant.enum";
import {FloorMapper} from "@restaurant/data/floor/floor.mapper";
import {getNoLoader} from "@core/interceptors/loader.interceptor";

@Injectable({
  providedIn: 'root',
})
export class FloorWebService implements FloorRepository{
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.FLOOR}`;
  #http = inject(HttpClient);


  getByEstab(establecimientoId: number) {
    return this.#http
      .get<ApiResponse>(`${this.#url}GetByEstab/${establecimientoId}`, {
        context: getNoLoader()
      })
      .pipe(map((response) => FloorMapper.fromApiGetByEstab(response)));
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponse>(`${this.#url}`, data)
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponse>(`${this.#url}${id}`, data)
  }

   remove(id: number): Observable<ApiResponse> {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
  }

}
