import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerRoleService {
  private http = inject(HttpClient);
  #url = CONFIG_PATHS.USER_CUSTOMER_ROLE;

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }
  get(parameters: any) {
    return this.http
      .get<ApiResponse>(`${this.#url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response: any) => response));
  }

  getAccessByRoleId<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 2,
    });
    return this.http.get<ApiResponse>(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        console.log(response);
      }),
    );
  }

  post(data: any) {
    return this.http.post<ApiResponse>(this.#url, data);
  }

  put(id: number, data: any) {
    return this.http.put<ApiResponse>(`${this.#url}${id}`, data);
  }

  putStatus(id: number, estado: boolean) {
    return this.http.put<ApiResponse>(`${this.#url}${id}/${estado}`, null);
  }
}
