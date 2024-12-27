import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { API_ENDPOINTS } from '@modules/common/core/enums/common.constants';
import { inject } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { UserManualRepository } from '@modules/common/core/repositories/user-manual.repository';

export class UserManualWebRepository extends UserManualRepository {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${PATHS_API.COMMON}${API_ENDPOINTS.USER_MANUAL}`;

  get<T>(parameters: T) {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${JSON.stringify(parameters)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { modules: [], userManuals: [] };
          }
          const { modules, userManuals } = JSON.parse(
            response.payload as string,
          );
          return { modules: modules || [], userManuals: userManuals || [] };
        }),
      );
  }
}
