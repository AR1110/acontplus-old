import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerPermissionService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_PERMISSION}`;
  private http = inject(HttpClient);

  getAll<T>(data: T) {
    const json = JSON.stringify({
      ...data,
      tipo: 1,
    });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        const [permissionsSale, permissionsProduct, permissionsCashBox] = response.permissions;

        permissionsSale.permission = JSON.parse(permissionsSale.permission);
        permissionsProduct.permission = JSON.parse(permissionsProduct.permission);
        permissionsCashBox.permission = JSON.parse(permissionsCashBox.permission);
        return {
          usersCustomerAdmin: response.usersCustomerAdmin,
          permissionsSale,
          permissionsProduct,
          permissionsCashBox,
        };
      }),
    );
  }

  put<T>(data: T) {
    return this.http.put(`${this.url}`, { data });
  }
}
