import { inject, Injectable } from '@angular/core';
import { PrinterRepository } from '@modules/config/data/repositories/printer.repository';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { customUrl } from '@core/interceptors/inject-session.interceptor';

@Injectable({
  providedIn: 'root',
})
export class PrinterWebRepository implements PrinterRepository {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.PRINTER}`;
  private readonly _urlPrinter = `${PATHS_API.PRINT_SERVER}GetPrinters`;

  getPrinters(): Observable<any> {
    const json = JSON.stringify({
      tipo: 1,
    });
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { printers: [] };
        }
        const { printers } = JSON.parse(response.payload as string);
        const results = printers.map((item: any) => {
          item.default = item.isDefault ? 'Si' : 'No';
          item.server = item.serverDevice ? 'Si' : 'No';
          item.labelEnabled = item.enabled ? 'Activa' : 'Inactiva';
          return item;
        });
        return {
          printers: results,
        };
      }),
    );
  }

  getDataForm(): Observable<any> {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { estabs: [], documents: [], printerTypes: [] };
        }
        const { estabs, documents, printerTypes } = JSON.parse(response.payload as string);
        return {
          estabs,
          documents,
          printerTypes,
        };
      }),
    );
  }

  getLocalPrinters(): Observable<any> {
    // Configure the request
    const requestOptions = {
      withCredentials: true, // This is equivalent to privateCredentials: 'include'
      context: customUrl(),
    };
    return this._http.get<ApiResponseLegacy>(this._urlPrinter, requestOptions).pipe(
      map((response) => {
        const mainData = response.payload;
        return {
          localPrinters: mainData,
        };
      }),
    );
  }

  getById(id: number): Observable<any> {
    const json = JSON.stringify({
      tipo: 3,
      id,
    });
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        const { documents, printer } = JSON.parse(response.payload as string);
        return {
          printer: printer[0],
          documents,
        };
      }),
    );
  }

  updateStatus<T>(id: number, data: T): Observable<ApiResponseLegacy> {
    return this._http
      .put<ApiResponseLegacy>(`${this._url}${id}`, data)
      .pipe(map((response) => response));
  }

  removePrinter(id: number): Observable<ApiResponseLegacy> {
    return this._http
      .delete<ApiResponseLegacy>(`${this._url}${id}`)
      .pipe(map((response) => response));
  }

  create<T>(data: T) {
    return this._http
      .post<ApiResponseLegacy>(`${this._url}`, data)
      .pipe(map((response) => response));
  }

  update<T>(id: number, data: T) {
    return this._http
      .put<ApiResponseLegacy>(`${this._url}${id}`, data)
      .pipe(map((response) => response));
  }
}
