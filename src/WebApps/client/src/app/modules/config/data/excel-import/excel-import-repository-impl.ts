import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ExcelImportRepository } from '@modules/config/data/repositories/excel-import.repository';
import { ImportacionResponse } from '@modules/config/data/models/importacion.model';

@Injectable({
  providedIn: 'root',
})
export class ExcelImportRepositoryImpl implements ExcelImportRepository {
  save(params: any): Observable<ApiResponseLegacy> {
    return this._http.post<ApiResponseLegacy>(`${this._url}/${params.code}`, params.data);
  }
  validateImportedData(params: any): Observable<ApiResponseLegacy> {
    return this._http.post<ApiResponseLegacy>(`${this._url}/GetValidation/${params.code}`, {
      jsonParams: JSON.stringify(params.data),
    });
  }
  getFormData(): Observable<ImportacionResponse> {
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${JSON.stringify({})}`).pipe(
      map((response) => {
        const modules = JSON.parse(response.payload as string);

        return {
          modules,
        } as ImportacionResponse;
      }),
    );
  }

  list() {
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${JSON.stringify({})}`).pipe(
      map((response) => {
        return {} as ImportacionResponse;
      }),
    );
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.IMPORTACION}`;
  private _http = inject(HttpClient);
}
