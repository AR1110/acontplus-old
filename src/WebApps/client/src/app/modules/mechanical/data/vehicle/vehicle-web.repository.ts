import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { VehicleRepository } from '@mechanical/domain/repositories/vehicle.repository';
import { VehicleMapper } from '@mechanical/data/vehicle/vehicle.mapper';
import { ListVehicleParams } from '@mechanical/domain/models/vehicle.model';
import { ListVehicleMapper } from '@mechanical/data/vehicle/list-vehicle.mapper';

@Injectable({
  providedIn: 'root',
})
export class VehicleWebRepository extends VehicleRepository {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.VEHICLE}`;
  #http = inject(HttpClient);

  getAll(obj: ListVehicleParams) {
    const json = ListVehicleMapper.toJson(obj);
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}` )
      .pipe(map((response) => ListVehicleMapper.fromJson(response)));
  }

  getDataForm() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}` )
      .pipe(map((response) => VehicleMapper.fromApiDataForm(response)));
  }

  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 3,
    });
    return this.#http
      .get(`${this.#url}?json=${json}` )
      .pipe(map((response: any) => VehicleMapper.fromApiGetId(response)));
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, { data });
  }

  remove(id: number) {
    return this.#http.delete<ApiResponseLegacy>(`${this.#url}${id}`);
  }

  putState(id: number, state: boolean) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}PutState/${id}/${state}`, null);
  }
}
