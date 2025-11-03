import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { RETENCION_ATS_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { DocSustentoPaymentRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-payment.repository';

@Injectable({
  providedIn: 'root',
})
export class DocSustentoPaymentWebRepository implements DocSustentoPaymentRepository {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${PATHS_API.RETENCION_ATS}${RETENCION_ATS_PATHS.DOC_SUSTENTO_PAGO}`;

  getById(id: number): Observable<ApiResponse> {
    throw new Error('Method not implemented.');
  }
  create<T>(data: T): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`${this._url}`, data).pipe(map((response) => response));
  }
  update<T>(id: number, data: T): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(`${this._url}${id}`, data).pipe(map((response) => response));
  }
  delete(id: number) {
    return this._http.delete<ApiResponse>(`${this._url}${id}`).pipe(map((response) => response));
  }
}
