import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "../constants/accounting.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { isApiResponse } from "@core/models/api-response";



@Injectable({
  providedIn: 'root'
})

export class AnticipoService {
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.ANTICIPO}`
  http = inject(HttpClient)

  getAll<T>(data: T) {
    let params = JSON.stringify({ ...data, tipo: 1 })
    return this.http.get(`${this.url}?json=${params}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {

            if (response.code === "0") {
              throw response;
            }
            if (response.code === "1") {
              let { anticipos } = JSON.parse(response.payload as string);
              console.log(anticipos)
              anticipos = anticipos.map((anticipo: any) => {
                return {
                  idAnticipo: anticipo.idAnticipo,
                  idTipoDocumento: anticipo.idTipoDocumento,
                  codEstab: anticipo.codEstab,
                  fechaEmision: anticipo.fechaEmision,
                  valor: anticipo.valor,
                  obs: anticipo.obs,
                  serieComprobante: anticipo.serieComprobante,
                  identificacion: anticipo.identificacion,
                  razonSocialCiente: anticipo.nombreFiscal,
                  subEntidadFinanciera: anticipo.subEntidadFinanciera,
                  estadoDoc: anticipo.estadoDoc,
                  codDoc: anticipo.codDoc,
                  usuario: anticipo.usuario,
                  identificacionUsuario: anticipo.identificacionUsuario,
                  totalRecords: anticipo.totalRecords,
                }
              })
              return anticipos
            }
          }
          return []
        })
      )
  }


  getDataForm() {
    let paramsStr = JSON.stringify({ tipo: 2 })
    return this.http.get(`${this.url}?json=${paramsStr}`)
      .pipe(
        map((response) => {
          let
            entidadesFinanciera = [],
            establecimientos = [],
            subEntidadesFinanciera = [];
          if (isApiResponse(response)) {
            let mainData = JSON.parse(response.payload as string);
            const { entidadFinanciera, establecimiento, subEntidadFinanciera } = mainData;

            entidadesFinanciera = entidadFinanciera;
            establecimientos = establecimiento;
            subEntidadesFinanciera = subEntidadFinanciera;
          }
          return {
            entidadesFinanciera,
            establecimientos,
            subEntidadesFinanciera,
          }
        })
      )
  }


  post<T>(data: T) {
    return this.http.post(`${this.url}`, { data })
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}`)
  }

}
