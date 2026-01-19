import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy, isApiResponse } from '@core/models/api-response-legacy';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { PATHS_API } from '@core/constants/global.constants';
import { UserSearch } from '@core/models/user.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER}`;
  private http = inject(HttpClient);

  search<T extends { textSearch: string }>(data: T): Observable<UserSearch[]> {
    const json = JSON.stringify({
      tipo: 3,
      textSearch: data.textSearch,
    });
    return this.http
      .get(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response: any) => {
          let userCustomers = [];
          if (response && typeof response === 'object') {
            userCustomers = response.userCustomers.map((user: any) => {
              return {
                idUsuario: user.idUsuario,
                nombreCompleto: user.fullname || user.fullName,
                nombreUsuario: user.username,
                nroIdentificacion: user.idCard,
              };
            });
          }
          return userCustomers;
        }),
      );
  }
}
