import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { VehicleRepository } from '@mechanical/domain/repositories/vehicle.repository';
import { VehicleMapper } from '@mechanical/data/vehicle/vehicle.mapper';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
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
      .get<ApiResponse>(`${this.#url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(map((response) => ListVehicleMapper.fromJson(response)));
  }

  getDataForm() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this.#http
      .get<ApiResponse>(`${this.#url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(map((response) => VehicleMapper.fromApiDataForm(response)));
  }

  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 3,
    });
    return this.#http
      .get(`${this.#url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(map((response: any) => VehicleMapper.fromApiGetId(response)));
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponse>(`${this.#url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponse>(`${this.#url}${id}`, { data });
  }

  remove(id: number) {
    return this.#http.delete<ApiResponse>(`${this.#url}${id}`);
  }

  putState(id: number, state: boolean) {
    return this.#http.put<ApiResponse>(`${this.#url}PutState/${id}/${state}`, null);
  }
}
