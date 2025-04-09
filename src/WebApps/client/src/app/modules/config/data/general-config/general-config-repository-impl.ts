import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {CONFIG_PATHS} from "@modules/config/enums/config.enums";
import {ApiResponse} from "@core/models/api-response";
import {GeneralConfigRepository} from "@modules/config/domain/repositories/general-config.repository";
import {ListGeneralConfigMapper} from "@modules/config/data/general-config/list-general-config.mapper";

@Injectable({
  providedIn: 'root',
})
export class GeneralConfigRepositoryImpl implements GeneralConfigRepository {
      update<T>(parameters: T): Observable<ApiResponse> {
        return this._http.put<ApiResponse>(this._url, { data: parameters });
    }

    list (parameters: string)  {
      return this._http
        .get<ApiResponse>(`${this._url}?json=${ListGeneralConfigMapper.toJson(parameters)}`)
        .pipe(
          map((response) => ListGeneralConfigMapper.fromJson(response, parameters))
        );
   }


  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.GENERAL_CONFIG}`;
  private _http = inject(HttpClient);
}
