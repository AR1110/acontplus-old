import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private url = CONFIG_PATHS.MENU;

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  get<T>(params: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(params)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { applications: [], menus: [] };
          }
          const { applications, menus } = JSON.parse(
            response.payload as string,
          );
          return { applications: applications || [], menus };
        }),
      );
  }

  getMenuByLicenseId(licenseId: number) {
    let json = JSON.stringify({
      tipo: 3,
      licenciaId: licenseId,
    });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        let { menus } = JSON.parse(response.payload as string);

        let result = menus.reduce((acc: any, cur: any) => {
          // Find or create the application
          let app = acc.find((a: any) => a.aplicacionId === cur.aplicacionId);
          if (!app) {
            app = {
              aplicacionId: cur.aplicacionId,
              name: cur.aplicacionName,
              children: [],
            };
            acc.push(app);
          }

          // Find or create the menu
          let menu = app.children.find((m: any) => m.menuId === cur.menuId);
          if (!menu) {
            menu = {
              menuId: cur.menuId,
              name: cur.menuName,
              children: [],
            };
            app.children.push(menu);
          }

          // Add the subMenu
          menu.children.push({
            menuId: cur.id,
            name: cur.name,
          });

          return acc;
        }, []);

        return {
          accesses: result,
        };
      }),
    );
  }

  post(data: any) {
    return this.http
      .post<ApiResponse>(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put<ApiResponse>(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
