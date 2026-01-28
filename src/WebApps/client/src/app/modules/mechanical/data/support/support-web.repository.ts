import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { SupportRepository } from '@mechanical/domain/repositories/support.repository';
import { SupportMapper } from '@mechanical/data/support/support.mapper';
import { FilterDataSupportMapper } from '@mechanical/data/support/filter-data-support.mapper';

@Injectable({
  providedIn: 'root',
})
export class SupportWebRepository extends SupportRepository {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.SUPPORT}`;
  #http = inject(HttpClient);

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
    });
    return this.#http
      .get(`${this.#url}?json=${json}`)
      .pipe(map((response: any) => SupportMapper.fromApiGetAll(response)));
  }

  getDataFilter() {
    const json = FilterDataSupportMapper.toJson();
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(map((response) => FilterDataSupportMapper.fromJson(response)));
  }

  getDataForm() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}` )
      .pipe(map((response) => SupportMapper.fromApiDataForm(response)));
  }

  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 3,
    });
    return this.#http
      .get(`${this.#url}?json=${json}` )
      .pipe(map((response: any) => SupportMapper.fromApiGetId(response)));
  }

  getDashboard() {
    const json = JSON.stringify({
      tipo: 6,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(map((response) => SupportMapper.fromApiDashboard(response)));
  }

  getConvertToAprobDoc(id: number) {
    const json = JSON.stringify({
      tipo: 5,
      id,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(map((response) => SupportMapper.fromApiGetAprobacion(response)));
  }

  getDocView(id: number) {
    const json = JSON.stringify({
      tipo: 7,
      id,
    });

    return this.#http
      .get(`${this.#url}?json=${json}`)
      .pipe(map((response: any) => SupportMapper.fromApiDocView(response)));
  }

  override generateSequential(idPuntoEmision: number): Observable<string> {
    const params = {
      tipo: 9,
      idPuntoEmision,
    };
    return this.#http.get<ApiResponseLegacy>(`${this.#url}?json=${JSON.stringify(params)}`).pipe(
      map((res) => {
        let secuencual = '' as string;
        if (res.code === '1') {
          const { sequence } = JSON.parse(res.payload as string);

          secuencual = sequence[0].serieComprobante;
        }
        return secuencual;
      }),
    );
  }

  search<T extends { textSearch: string }>(obj: T) {
    const json = JSON.stringify({
      tipo: 4,
      textSearch: obj.textSearch,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(map((response) => SupportMapper.fromApiSearch(response)));
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

  putState(id: number, supportStatusId: number) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}PutState/${id}/${supportStatusId}`, null);
  }
}
