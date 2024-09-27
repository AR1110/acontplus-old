import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { PURCHASE_PATHS } from '../constants/purchase.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse, isApiResponse } from '@core/models/api-response';
import { DocumentoReceived } from '@purchase/models/document-received.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentReceivedService {
  #url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.DOCUMENT_RECEIVED}`;
  #http = inject(HttpClient);

  getDataFilter() {
    let query = {
      tipo: 2,
    };
    return this.#http.get(`${this.#url}?json=${JSON.stringify(query)}`).pipe(
      map((response) => {
        if (isApiResponse(response)) {
          let mainData = JSON.parse(response.payload as string);
          const tiposComprobante = mainData.tipoComprobantes.map(
            (tipoDoc: any) => {
              return {
                descripcion: tipoDoc.descripcion,
                codigoSri: tipoDoc.codDoc,
              };
            },
          );
          return {
            establecimientos: mainData.establecimientos,
            subcategories: mainData.subcategories,
            tiposComprobante,
          };
        }
        return {
          establecimientos: [],
          tiposComprobante: [],
        };
      }),
    );
  }

  get<T>(params: T) {
    return this.#http
      .get<ApiResponse>(`${this.#url}?json=${JSON.stringify(params)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { documents: [] as DocumentoReceived[] };
          }
          const { documentos } = JSON.parse(response.payload as string);
          return {
            documents: (documentos as DocumentoReceived[]) || [],
          };
        }),
      );
  }
}
