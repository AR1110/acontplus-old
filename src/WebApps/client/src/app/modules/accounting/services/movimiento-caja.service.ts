import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "../constants/accounting.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { isApiResponse } from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})

export class MovimientoCajaService {

  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.MOVIMIENTO_CAJA}`;
  private http = inject(HttpClient)

  getAll<T>(obj: T) {
    let paramsStr = JSON.stringify({ ...obj, tipo: 1 })
    return this.http.get(`${this.url}Get?json=${paramsStr}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            if (response.code === "0") {
              throw response;
            }
            if (response.code === "1") {
              let { movimientos } = JSON.parse(response.payload as string)
              return movimientos;
            }
          }
          return []
        })
      )
  }

  getDataForm() {
    let paramsStr = JSON.stringify({ tipo: 2 })
    return this.http.get(`${this.url}Get?json=${paramsStr}`)
      .pipe(
        map((response) => {
          let cajas = [],
            entidadesFinanciera = [],
            establecimientos = [],
            subEntidadesFinanciera = [],
            tiposDocumentos = []
          if (isApiResponse(response)) {
            let mainData = JSON.parse(response.payload as string);
            const { caja, entidadFinanciera, establecimiento, subEntidadFinanciera, tipoDocumento } = mainData;

            cajas = caja,
              entidadesFinanciera = entidadFinanciera,
              establecimientos = establecimiento,
              subEntidadesFinanciera = subEntidadFinanciera,
              tiposDocumentos = tipoDocumento
          }
          return {
            cajas,
            entidadesFinanciera,
            establecimientos,
            subEntidadesFinanciera,
            tiposDocumentos
          }
        })
      )
  }

}
