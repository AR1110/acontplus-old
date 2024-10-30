import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';

import { SALE_PATHS } from '../enums/sale.enum';
import { NotaEntregaAdapter } from '../adapters/nota-entrega.adapter';

@Injectable({
  providedIn: 'root'
})
export class NotaEntregaService {
  #url = `${PATHS_API.SALES}${SALE_PATHS.NOTA_ENTREGA}`;
  #http = inject(HttpClient);

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.#http.get<ApiResponse>(`${this.#url}Get?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let result = {
          data: [] as any[],
          totalRecords: 0
        }
        if (response.code === "1") {
          let [notasEntrega] = JSON.parse(response.payload as string)

          notasEntrega = notasEntrega || [];

          result.data = notasEntrega.map((item: any) => {
            return {
              idCuentaPorCobrar: item.idCuentaPorCobrar,
              idDocumento: item.idDocumento,
              codEstab: item.codEstab,
              fechaEmision: item.fechaEmision,
              fechaVencimiento: item.fechaVencimiento,
              serieComprobante: item.serieComprobante,
              razonSocialComprador: item.nombreFiscal,
              identificacionComprador: item.identificacionComprador,
              estadoNom: item.estadoFinanciero,
              total: item.total,
              abono: item.abono,
              saldo: item.saldo,
              usuario: item.usuario,
              tiempoCredito: item.tiempoCredito,
              codEstado: item.codEstado,
              convertToDoc: item.convertToDoc,
              totalRecords: item.totalRecords,
            }
          })

          result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
        }
        console.log(result)
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
      map(response=>{
        let result = {} as any;
         if(response.code==="1"){
          let mainData = JSON.parse(response.payload as string)
           result = NotaEntregaAdapter.fromApiDetalleCompleto(mainData)
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
