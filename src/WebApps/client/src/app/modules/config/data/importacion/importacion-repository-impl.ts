import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {CONFIG_PATHS} from "@modules/config/domain/enums/config.enums";
import {ApiResponse} from "@core/models/api-response";
import {ImportacionRepository} from "@modules/config/domain/repositories/importacion.repository";
import {ImportacionResponse} from "@modules/config/domain/models/importacion.model";

@Injectable({
  providedIn: 'root',
})
export class ImportacionRepositoryImpl implements ImportacionRepository {
     getFormData(): Observable<ImportacionResponse> {
       return this._http
         .get<ApiResponse>(`${this._url}?json=${JSON.stringify({})}`)
         .pipe(
           map((response) => {
             let modules = JSON.parse(response.payload as string);

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
