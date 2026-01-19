import { inject, Injectable } from '@angular/core';
import { PrinterRepository } from '@modules/config/data/repositories/printer.repository';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { customUrl } from '@core/interceptors/inject-session.interceptor';
import { SolicitudUsuarioRepository } from '@modules/config/data/repositories/solicitud-usuario.repository';
import { groupEstabUtil } from '@core/utils/group-estab.util';

@Injectable({
  providedIn: 'root',
})
export class SolicitudUsuarioWebRepository implements SolicitudUsuarioRepository {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_REQUEST}`;
  private http = inject(HttpClient);

  getFilter() {
    const json = JSON.stringify({
      tipo: 3,
    });

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        if (response !== null && typeof response === 'object') {
          const estabs = groupEstabUtil({
            estabs: response.estabs,
            isGroupPuntoEmision: true,
          });

          return {
            establecimientos: estabs,
            usersRole: response.usersRole,
          };
        }

        return {
          establecimientos: [],
          usersRole: [],
        };
      }),
    );
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
    });

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let requests = [] as any[];
        if (response !== null && typeof response === 'object') {
          requests = response.requests || [];
        }
        return {
          data: requests.map((item: any, index: number) => {
            return {
              index: index + 1,
              ...item,
            };
          }),
        };
      }),
    );
  }

  put<T>(data: T) {
    return this.http.put<ApiResponseLegacy>(`${this.url}`, { data });
  }
}
