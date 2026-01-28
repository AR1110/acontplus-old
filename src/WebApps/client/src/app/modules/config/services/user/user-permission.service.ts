import { Injectable, inject } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';

import { HttpClient } from '@angular/common/http';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  private http = inject(HttpClient);

  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_PERMISSION}`;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  checkHasPermission<T>(params: T) {
    const paramsStr = JSON.stringify(params);
    return this.http.get<ApiResponseLegacy>(`${this.url}CheckHasPermission/${paramsStr}`);
  }
}
