import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { map } from 'rxjs';
import { ActionSubMenu } from '@modules/seguridad/domain/models/action.model';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class SubmenuService {
  private http = inject(HttpClient);
  private url = CONFIG_PATHS.SUBMENU;

  getDataForm() {
    let json = JSON.stringify({
      tipo: 2,
    });
    return this.http.get<ActionSubMenu[]>(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        return response.actions.map((a: any) => ({
          actionId: a.id,
          code: a.code,
          name: a.name,
        }));
      }),
    );
  }

  getId(menuId: number) {
    let json = JSON.stringify({
      tipo: 3,
      id: menuId,
    });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let { subMenu, actions, submenuAction } = response;

        let data = subMenu[0];
        let mergeActions: ActionSubMenu[] = [...actions, ...submenuAction]
          .sort((a, b) => a.actionId - b.actionId)
          .map((a) => ({
            id: a.id,
            actionId: a.actionId,
            code: a.code,
            name: a.name,
            completed: a.isActive,
          }));

        return {
          data,
          actions: mergeActions,
        };
      }),
    );
  }

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  post<T>(data: T) {
    return this.http.post<ApiResponse>(`${this.url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this.url}${id}`, { data });
  }
}
