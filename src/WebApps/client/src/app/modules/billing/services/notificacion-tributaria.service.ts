import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { BILLING_PATHS } from '@billing/domain/enums/billing.enum.ts';

@Injectable({
  providedIn: 'root',
})
export class NotificacionTributariaService {
  private readonly _url = `${PATHS_API.BILLING}${BILLING_PATHS.NOTIFICACION_TRIBUTARIA}`;
  private readonly _http = inject(HttpClient);

  post<T>(data: T) {
    return this._http.post(`${this._url}`, data);
  }
}
