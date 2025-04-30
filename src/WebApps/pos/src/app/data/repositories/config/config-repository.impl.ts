import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs';
import {PATHS, PATHS_API} from '@domain/enums/main.enum';
import {ConfigRepository} from '@domain/repositories/config.repository';
import {ApiResponse, withoutSpinner} from 'acontplus-utils';
import {FormDataConfigParams} from '@/domain/models/config.model';
import {GetFormDataConfigMapper} from "@data/repositories/config/get-form-data-config.mapper";
import {GetEstabsConfigMapper} from "@data/repositories/config/get-estabs-config.mapper";

@Injectable({
  providedIn: 'root',
})
export class ConfigRepositoryImpl implements ConfigRepository {
  private _url = `${PATHS_API.RESTAURANT}${PATHS.CONFIG}`;

  constructor(private http: HttpClient) {
  }

  getEstabs() {
    const json = JSON.stringify({
      tipo: 1,
    });
    return this.http
      .get<ApiResponse>(`${this._url}?json=${json}`, {
        context: withoutSpinner(),
      })
      .pipe(
        map((response) => GetEstabsConfigMapper.fromJson(response)),
      );
  }

  getFormData(obj: FormDataConfigParams) {
    const json = GetFormDataConfigMapper.toJson(obj)

    return this.http
      .get<ApiResponse>(`${this._url}?json=${json}`, {
        context: withoutSpinner(),
      })
      .pipe(
        map((response) => GetFormDataConfigMapper.fromJson(response)),
      );
  }
}
