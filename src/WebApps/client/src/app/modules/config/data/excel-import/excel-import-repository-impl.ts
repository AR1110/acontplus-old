import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {CONFIG_PATHS} from "@modules/config/domain/enums/config.enums";
import {ApiResponse} from "@core/models/api-response";
import {ExcelImportRepository} from "@modules/config/domain/repositories/excel-import.repository";
import {ImportacionResponse} from "@modules/config/domain/models/importacion.model";

@Injectable({
  providedIn: 'root',
})
export class ExcelImportRepositoryImpl implements ExcelImportRepository {
      save(params: any): Observable<ApiResponse> {
        return this._http.post<ApiResponse>(`${this._url}${params.code}`, params.data)
    }
      validateImportedData(params:any): Observable<ApiResponse> {
        console.log(params)
        return this._http.post<ApiResponse>(`${this._url}/GetValidation/${params.code}`, params.data)
    }
     getFormData(): Observable<ImportacionResponse> {
       return this._http
         .get<ApiResponse>(`${this._url}?json=${JSON.stringify({})}`)
         .pipe(
           map((response) => {
             const modules = JSON.parse(response.payload as string);

             return {
               modules
             } as ImportacionResponse
           })
         );
    }

    list ( )  {
      return this._http
        .get<ApiResponse>(`${this._url}?json=${JSON.stringify({})}`)
        .pipe(
          map((response) => {
            return {} as ImportacionResponse
          })
        );
   }


  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.IMPORTACION}`;
  private _http = inject(HttpClient);
}
