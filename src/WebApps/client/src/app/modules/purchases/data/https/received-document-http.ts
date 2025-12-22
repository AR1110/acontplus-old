import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { PURCHASE_PATHS } from '@purchases/purchases.const';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy, isApiResponse } from '@core/models/api-response-legacy';
import { DocumentReceived } from '@purchase/domain/document-received.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import {ReceivedDocumentRepository} from "@purchases/data/repositories/received-document";

@Injectable({
  providedIn: 'root',
})
export class ReceivedDocumentHttp implements ReceivedDocumentRepository {
  private readonly _url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.DOCUMENT_RECEIVED}`;
  private readonly _http = inject(HttpClient);

  getDataFilter() {
    const query = {
      tipo: 2,
    };
    return this._http.get(`${this._url}?json=${JSON.stringify(query)}`).pipe(
      map((response) => {
        if (isApiResponse(response)) {
          const mainData = JSON.parse(response.payload as string);
          const documentTypes = mainData.tipoComprobantes.map((tipoDoc: TipoDoc) => {
            return {
              descripcion: tipoDoc.descripcion,
              codigoSri: tipoDoc.codigoSri,
            };
          });
          return {
            establecimientos: mainData.establecimientos,
            subcategories: mainData.subcategories,
            documentTypes: documentTypes,
          };
        }
        return {
          establecimientos: [],
          subcategories: [],
          documentTypes: [],
        };
      }),
    );
  }

  get<T>(params: T) {
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${JSON.stringify(params)}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { documents: [] as DocumentReceived[] };
        }
        const { documentos } = JSON.parse(response.payload as string);
        return {
          documents: (documentos as DocumentReceived[]) || [],
        };
      }),
    );
  }

  getById(id: number) {
    return this._http.get<ApiResponseLegacy>(`${this._url}${id}`);
  }

  create(data: any) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, data);
  }

  delete(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }

  previewXml(id: number): Observable<ApiResponseLegacy> {
    return this._http
      .get<ApiResponseLegacy>(`${this._url}Preview/${id}`)
      .pipe(map((response: ApiResponseLegacy) => response));
  }
  update(id: number, data: any) {
    return this._http.put<ApiResponseLegacy>(`${this._url}${id}`, data);
  }

  uploadXml(parameters: any, file: any) {
    return this._http.post<ApiResponseLegacy>(
      `${this._url}uploadxml/?json=${JSON.stringify(parameters)}`,
      file,
    );
  }
}
