import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'acontplus-utils';
import { API_ENDPOINTS } from '@modules/common/constants/common.constants';
import { forkJoin, map, Observable } from 'rxjs';
import { UserManualTypeService } from '@modules/common/services/user-manual-type.service';
import { MenuService } from '@modules/config/services/menu.service';

import { UserManual } from '@modules/common/domain/models/user-manual.model';

@Injectable({
  providedIn: 'root',
})
export class UserManualService {
  #http = inject(HttpClient);
  #url = `${API_ENDPOINTS.USER_MANUAL}`;
  private readonly _menuService = inject(MenuService);
  private readonly _userManualTypeService = inject(UserManualTypeService);

  getDataForm(): Observable<{
    menus: any[];
    userManualTypes: any[];
  }> {
    return forkJoin([
      this._menuService.get({ tipo: 1 }),
      this._userManualTypeService.get(),
    ]).pipe(
      map(([menusResponse, userManualTypesResponse]) => ({
        menus: menusResponse.menus,
        userManualTypes: userManualTypesResponse.userManualTypes,
      })),
    );
  }

  get(params: any) {
    return this.#http
      .get<ApiResponse>(
        `${this.#url}?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&textSearch=${params.textSearch}`,
      )
      .pipe(
        map((response) => {
          if (response.code != '1') {
            return { userManuals: [] };
          }
          const { userManuals, totalRecords } =
            response.payload as any
          return { userManuals: userManuals || [], totalRecords };
        }),
      );
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponse>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponse>(`${this.#url}${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number) {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }
}
