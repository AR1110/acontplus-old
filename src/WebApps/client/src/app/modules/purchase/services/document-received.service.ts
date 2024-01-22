
import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { PURCHASE_PATHS } from "../constants/purchase.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { isApiResponse } from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})

export class DocumentReceivedService {

  private url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.DOCUMENT_RECEIVED}`
  private http = inject(HttpClient)

  getDataFilter() {
    let query = {
      tipo: 2
    }
    return this.http.get(`${this.url}?json=${JSON.stringify(query)}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            let mainData = JSON.parse(response.payload as string) 
            const tiposComprobante = mainData.tipoComprobantes.map((tipoDoc: any) => {
              return {
                descripcion: tipoDoc.descripcion,
                codigoSri: tipoDoc.codDoc
              }
            })
            return {
              establecimientos: mainData.establecimientos,
              tiposComprobante
            }
          }
          return {
            establecimientos: [],
            tiposComprobante: []
          }
        })
      )


  }


}
