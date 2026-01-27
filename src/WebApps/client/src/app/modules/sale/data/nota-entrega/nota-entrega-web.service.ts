import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotaEntregaRepository } from '@sale/domain/repositories/nota-entrega.repository';
import { SALE_PATHS } from '@sale/domain/enums/sale.enum';
import { NotaEntregaMapper } from '@sale/data/nota-entrega/nota-entrega.mapper';

@Injectable({
  providedIn: 'root',
})
export class NotaEntregaWebRepository implements NotaEntregaRepository {
  #url = `${PATHS_API.SALES}${SALE_PATHS.NOTA_ENTREGA}`;
  #http = inject(HttpClient);

  getDataFilter() {
    const json = JSON.stringify({
      tipo: 3,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${json}` )
      .pipe(map((response) => NotaEntregaMapper.fromApiDataFilter(response)));
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${json}` )
      .pipe(map((response) => NotaEntregaMapper.fromApiGetAll(response)));
  }

  getDetalleCompleto(id: number) {
    const json = JSON.stringify({
      tipo: 5,
      id,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${json}` )
      .pipe(map((response) => NotaEntregaMapper.fromApiDetalleCompleto(response)));
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}Insert`, { data });
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, { data });
  }
}
