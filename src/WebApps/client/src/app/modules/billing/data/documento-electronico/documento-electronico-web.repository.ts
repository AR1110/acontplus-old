import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ApiResponse } from '@core/models/api-response';
import { BILLING_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { DocumentoElectronicoRepository } from '@billing/domain/repositories/documento-electronico.repository';
import { DocumentoElectronico } from '@billing/domain/models/documento-electronico.model';
import { SharedService } from '@core/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentoElectronicoWebRepository
  implements DocumentoElectronicoRepository
{
  private readonly _url = `${PATHS_API.FACT_ELECT}${BILLING_PATHS.DOC_ELECT}`;
  private readonly _http = inject(HttpClient);
  private readonly _sharedService = inject(SharedService);

  authorize(id: number) {
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, '')
      .pipe(map((response) => response));
  }
  cancel(id: number) {
    return this._http
      .put<ApiResponse>(`${this._url}Cancel/${id}`, '')
      .pipe(map((response) => response));
  }
  downloadXml(id: number) {
    return this._http
      .get(`${this._url}GetXmlSri/${id}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          this._sharedService.saveFile(response);
          return response.body!;
        }),
      );
  }

  getDataFilter() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        const mainData = JSON.parse(response.payload as string);

        const tempEstabsAndPtosEmision = mainData[0];
        const tiposDoc = mainData[1] as any[];
        const estadosDoc = mainData[2] as any[];

        const estabs = groupEstabUtil({
          estabs: tempEstabsAndPtosEmision,
          isGroupPuntoEmision: true,
        });
        return {
          estabs,
          tiposDoc,
          estadosDoc,
        };
      }),
    );
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { documentosElectronicos: [] };
        }
        const [results] = JSON.parse(response.payload as string);

        return { documentosElectronicos: results as DocumentoElectronico[] };
      }),
    );
  }
}
