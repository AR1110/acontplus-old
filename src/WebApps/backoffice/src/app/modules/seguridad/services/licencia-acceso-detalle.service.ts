import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';
import { SECURITY_API } from '@modules/seguridad/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class LicenciaAccesoDetalleService {
  private http = inject(HttpClient);
  private url = SECURITY_API.LICENCIA_ACCESO_DETALLE;

  getActionsBymenuId(id: number, menuId: number) {
    let json = JSON.stringify({
      tipo: 3,
      id,
      menuId,
    });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        let { actions, detail } = JSON.parse(response.payload as string);
        let { actions: actionsSelected } = JSON.parse(detail);
        actionsSelected = JSON.parse(actionsSelected) || [];

        let actionsRawAndSelected =
          actions?.map((a: any) => {
            return {
              id: a.id,
              name: a.name,
              code: a.code,
              completed: actionsSelected.some((aS: any) => aS.code === a.code),
            };
          }) ?? [];

        return {
          actionsRawAndSelected,
        };
      }),
    );
  }

  get<T>(parameters: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }

  post<T>(data: T) {
    return this.http
      .post<ApiResponse>(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.http
      .put<ApiResponse>(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.url}${id}`)
      .pipe(map((response) => response));
  }
}
