import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { formatDate } from '@core/utils/date.util';
import { isValidJSON } from '@core/utils/utils';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { InspectionRepository } from '@mechanical/domain/repositories/inspection.repository';
import { InspeccionMapper } from '@mechanical/data/inspection/inspeccion.mapper';

@Injectable({
  providedIn: 'root',
})
export class InspectionWebRepository implements InspectionRepository {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.INSPECTION}`;
  #http = inject(HttpClient);

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}` )
      .pipe(map((response) => InspeccionMapper.getAll(response)));
  }

  getDataForm(supportId: number) {
    const json = JSON.stringify({
      supportId,
      tipo: 2,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(map((response) => InspeccionMapper.getDataForm(response)));
  }

  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 3,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(map((response) => InspeccionMapper.getId(response)));
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
}
