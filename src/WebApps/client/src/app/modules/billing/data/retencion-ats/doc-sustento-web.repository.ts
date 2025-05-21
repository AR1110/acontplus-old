import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { RETENCION_ATS_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, isApiResponse } from '@core/models/api-response';
import { DocSustentoRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento.repository';

@Injectable({
  providedIn: 'root',
})
export class DocSustentoWebRepository implements DocSustentoRepository {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${PATHS_API.RETENCION_ATS}${RETENCION_ATS_PATHS.DOC_SUSTENTO}`;

  getTaxes<T>(parameters: T) {
    const obj = { tipo: 1, ...parameters };
    const defaultData = this.getDefaultData();

    return this._http.get(`${this._url}?json=${JSON.stringify(obj)}`).pipe(
      map((response) => {
        if (!isApiResponse(response)) return defaultData;

        try {
          const payload = JSON.parse(response.payload as string);
          return {
            ...defaultData,
            ...payload,
          };
        } catch (error) {
          console.error('Error parsing response:', error);
          return defaultData;
        }
      }),
    );
  }

  private getDefaultData() {
    return {
      doc: [],
      taxes: [],
      payments: [],
    };
  }
  getById(id: number): Observable<ApiResponse> {
    throw new Error('Method not implemented.');
  }
  create<T>(data: T): Observable<ApiResponse> {
    return this._http
      .post<ApiResponse>(`${this._url}`, data)
      .pipe(map((response) => response));
  }
  update<T>(id: number, data: T): Observable<ApiResponse> {
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, data)
      .pipe(map((response) => response));
  }
  delete(id: number) {
    return this._http
      .delete<ApiResponse>(`${this._url}${id}`)
      .pipe(map((response) => response));
  }
}
