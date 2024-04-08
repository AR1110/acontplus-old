import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "../constants/accounting.constants";
import { map } from "rxjs";
import { isApiResponse } from "@core/models/api-response";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ComprobanteIngresoService {
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_INGRESO}`;
  private http = inject(HttpClient);

  getAll<T>(obj: T) {
    let params = JSON.stringify({ ...obj, tipo: 1 })
    return this.http.get(`${this.url}?json=${params}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {

            if (response.code === "0") {
              throw response;
            }
            if (response.code === "1") {
              let [comprobantesIngreso] = JSON.parse(response.payload as string);
              console.log(comprobantesIngreso)
              let results = comprobantesIngreso.map((compIngreso: any) => {
                return {
                  codDoc: 'CI',
                  idComprobanteIngreso: compIngreso.idComprobanteIngreso,
                  idDocumento: compIngreso.idDocumento,
                  codEstab: compIngreso.codEstab,
                  total: compIngreso.total,
                  fechaRegistro: compIngreso.fechaRegistro,
                  abono: compIngreso.abono,
                  cambio: compIngreso.cambio,
                  nroDoc: compIngreso.nroDoc,
                  cliente: compIngreso.cliente,
                  nroIdentificacion: compIngreso.nroIdentificacion,
                  caja: compIngreso.caja,
                  style: compIngreso.style,
                  estado: compIngreso.estado,
                  usuario: compIngreso.usuario,
                }
              })
              return results;
            }
          }
          return []
        })
      )
  }

}
