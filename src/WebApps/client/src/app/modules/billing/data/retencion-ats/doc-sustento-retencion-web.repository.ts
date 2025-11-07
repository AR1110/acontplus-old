import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { RETENCION_ATS_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { DocSustentoRetencionRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-retencion.repository';

@Injectable({
  providedIn: 'root',
})
export class DocSustentoRetencionWebRepository implements DocSustentoRetencionRepository {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${PATHS_API.RETENCION_ATS}${RETENCION_ATS_PATHS.DOC_SUST_RETENCION}`;

  getById(id: number): Observable<ApiResponseLegacy> {
    throw new Error('Method not implemented.');
  }
  create<T>(data: T): Observable<ApiResponseLegacy> {
    return this._http
      .post<ApiResponseLegacy>(`${this._url}`, data)
      .pipe(map((response) => response));
  }
  update<T>(id: number, data: T): Observable<ApiResponseLegacy> {
    return this._http
      .put<ApiResponseLegacy>(`${this._url}${id}`, data)
      .pipe(map((response) => response));
  }
  delete(id: number) {
    return this._http
      .delete<ApiResponseLegacy>(`${this._url}${id}`)
      .pipe(map((response) => response));
  }
}
