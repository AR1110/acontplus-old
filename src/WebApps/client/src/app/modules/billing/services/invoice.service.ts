import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { BILLING_PATHS } from '../enums/billing.enum.ts';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { map } from 'rxjs';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { InvoiceAdapter } from '../adapters/invoice/invoice.adapter';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  #url = `${PATHS_API.BILLING}${BILLING_PATHS.INVOICE}`
  #http = inject(HttpClient)

  getDataFilter() {
    let json = JSON.stringify({
      tipo: 4
    })
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(map(response => {

      let resultData = {
        estabs: [] as GroupedEstab[],
        estadosDoc: [] as any[]
      }

      if (response.code === "1") {
        let [tempEstabs, estadosDoc] = JSON.parse(response.payload as string);


        let dataToGroup = {
          estabs: tempEstabs,
          isGroupPuntoEmision: true
        }
        resultData.estabs = groupEstabUtil(dataToGroup);
        resultData.estadosDoc = estadosDoc;
      }

      return resultData;

    }))
  }

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let result = {
          data: [] as any[],
          totalRecords: 0
        }
        if (response && response.code === "1") {
          let [data] = JSON.parse(response.payload as string)

          data = data || [];

          result.data = InvoiceAdapter.fromApiAll(data)
          result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
        }
        return result;
      })
    )
  }


  getDetalleCompleto(id: number) {
    let json = JSON.stringify({
      tipo: 5,
      id
    })
    return this.#http.get<ApiResponse>(`${this.#url}Get?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let result = {} as any;
        if (response.code === "1") {
          let mainData = JSON.parse(response.payload as string)
          result = InvoiceAdapter.fromApiDetalleCompleto(mainData)
        }

        return result
      })
    )
  }


  post<T>(data: T) {

    return this.#http.post(`${this.#url}Insert`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }
}
