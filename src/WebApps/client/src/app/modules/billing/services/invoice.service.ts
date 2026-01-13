import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { map } from 'rxjs';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { InvoiceAdapter } from '../data/invoice/mappers/invoice.adapter';
import { BILLING_PATHS } from '@billing/domain/enums/billing.enum.ts';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  #url = `${PATHS_API.BILLING}${BILLING_PATHS.INVOICE}`;
  #http = inject(HttpClient);

  getDataFilter() {
    const json = JSON.stringify({
      tipo: 4,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          const resultData = {
            estabs: [] as GroupedEstab[],
            estadosDoc: [] as any[],
          };

          if (response.code === '1') {
            const { estabs, status } = JSON.parse(response.payload as string);

            const dataToGroup = {
              estabs,
              isGroupPuntoEmision: true,
            };
            resultData.estabs = groupEstabUtil(dataToGroup);
            resultData.estadosDoc = status;
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
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(
        map((response) => {
          const result = {
            data: [] as any[],
            totalRecords: 0,
          };
          if (response?.code === '1') {
            const { invoices } = JSON.parse(response.payload as string);
            result.data = InvoiceAdapter.fromApiAll(invoices ?? []);
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
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let result = {} as any;
          if (response.code === '1') {
            const mainData = JSON.parse(response.payload as string);
            result = InvoiceAdapter.fromApiDetalleCompleto(mainData);
          }

          return result;
        }),
      );
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, { data });
  }
}
