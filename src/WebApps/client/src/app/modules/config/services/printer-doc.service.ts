import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class PrinterDocService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.PRINTER_DOC}`;

  post<T>(data: T) {
    return this.http.post<ApiResponseLegacy>(`${this.url}/`, data);
  }

  put<T>(id: number, data: T) {
    return this.http.put<ApiResponseLegacy>(`${this.url}/${id}`, data);
  }
}
