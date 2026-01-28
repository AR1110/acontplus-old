import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LicenseType } from '@modules/config/models/license-type';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class LicenseTypeService {
  private http = inject(HttpClient);
  private url = CONFIG_PATHS.LICENSE_TYPE;

  get<T>(parameters: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }
  post(data: LicenseType) {
    return this.http
      .post<ApiResponse>(`${this.url}`, data)
      .pipe(map((response) => response));
  }
  put(id: number, data: LicenseType) {
    return this.http
      .put<ApiResponse>(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
