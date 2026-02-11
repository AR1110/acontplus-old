import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FloorRepository } from '@restaurant/data/repositories/floor.repository';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { FloorMapper, GetFloorsByEstabIdMapper } from '@restaurant/data/mappers/floor-mapper';
import { GetFloorsByEstabIdResponse } from '@restaurant/data/models/floor.model';

@Injectable({
  providedIn: 'root',
})
export class FloorHttp implements FloorRepository {
  getByEstablishmentId(establishmentId: number): Observable<GetFloorsByEstabIdResponse> {
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}GetByEstab/${establishmentId}` )
      .pipe(map((response) => GetFloorsByEstabIdMapper.fromJson(response)));
  }
  deleteById(id: number): Observable<ApiResponseLegacy> {
    throw new Error('Method not implemented.');
  }
  create<T>(data: T): Observable<ApiResponseLegacy> {
    throw new Error('Method not implemented.');
  }
  update<T>(id: number, data: T): Observable<ApiResponseLegacy> {
    throw new Error('Method not implemented.');
  }
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.FLOOR}`;
  #http = inject(HttpClient);

  getByEstab(establecimientoId: number) {
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}GetByEstab/${establecimientoId}` )
      .pipe(map((response) => FloorMapper.fromJson(response)));
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, data);
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, data);
  }

  remove(id: number): Observable<ApiResponseLegacy> {
    return this.#http.delete<ApiResponseLegacy>(`${this.#url}${id}`);
  }
}
