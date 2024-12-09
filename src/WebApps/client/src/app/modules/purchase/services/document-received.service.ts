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
          const documentTypes = mainData.tipoComprobantes.map(
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
            documentTypes: documentTypes,
          };
        }
        return {
          establecimientos: [],
          documentTypes: [],
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

  getById(id: number) {
    return this.#http
      .get<ApiResponse>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }

  uploadXml(parameters: any, file: any) {
    return this.#http
      .post<ApiResponse>(
        `${this.#url}uploadxml/?json=${JSON.stringify(parameters)}`,
        file,
      )
      .subscribe((response) => response);
  }
}
