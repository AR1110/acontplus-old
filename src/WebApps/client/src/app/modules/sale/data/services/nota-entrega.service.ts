import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';

import { SALE_PATHS } from '@sale/domain/enums/sale.enum';
import { NotaEntregaAdapter } from '../nota-entrega.adapter';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { GroupedEstab } from '@core/models/estab.model';

@Injectable({
  providedIn: 'root',
})
export class NotaEntregaService {
  #url = `${PATHS_API.SALES}${SALE_PATHS.NOTA_ENTREGA}`;
  #http = inject(HttpClient);

  getDataFilter() {
    const json = JSON.stringify({
      tipo: 3,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${json}` )
      .pipe(
        map((response) => {
          const resultData = {
            estabs: [] as GroupedEstab[],
            estadosDoc: [] as any[],
          };

          if (response.code === '1') {
            const [tempEstabs, estadosDoc] = JSON.parse(response.payload as string);

            const dataToGroup = {
              estabs: tempEstabs,
              isGroupPuntoEmision: true,
            };
            resultData.estabs = groupEstabUtil(dataToGroup);
            resultData.estadosDoc = estadosDoc;
          }

          return resultData;
        }),
      );
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${json}` )
      .pipe(
        map((response) => {
          const result = {
            data: [] as any[],
            totalRecords: 0,
          };
          if (response?.code === '1') {
            let [notasEntrega] = JSON.parse(response.payload as string);

            notasEntrega = notasEntrega || [];

            result.data = NotaEntregaAdapter.fromApiAll(notasEntrega);
            result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
          }
          return result;
        }),
      );
  }

  getDetalleCompleto(id: number) {
    const json = JSON.stringify({
      tipo: 5,
      id,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${json}` )
      .pipe(
        map((response) => {
          let result = {} as any;
          if (response.code === '1') {
            const mainData = JSON.parse(response.payload as string);
            result = NotaEntregaAdapter.fromApiDetalleCompleto(mainData);
          }

          return result;
        }),
      );
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}Insert`, { data });
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, { data });
  }
}
