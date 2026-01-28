import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerService {
  private URL = CONFIG_PATHS.USER_CUSTOMER;

  constructor(private http: HttpClient) {}

  getAll(obj: object) {
    return this.http
      .get<ApiResponse>(this.URL, {
        params: {
          json: JSON.stringify(Object.assign(obj, { tipo: 1 })),
        },
      })
      .pipe(map((response: any) => response.userCustomers));
  }

  search(obj: object) {
    return this.http
      .get<ApiResponse>(this.URL, {
        params: {
          json: JSON.stringify(Object.assign(obj, { tipo: 3 })),
        },
      })
      .pipe(map((response: any) => response.userCustomers));
  }

  //usuario-asignacion-role-
  getDataForm() {
    return this.http
      .get<ApiResponse>(this.URL, {
        params: {
          json: JSON.stringify({ tipo: 2 }),
        },
      })
      .pipe(map((response: any) => response));
  }

  post(data: any) {
    return this.http
      .post<ApiResponse>(this.URL, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put<ApiResponse>(`${this.URL}${id}`, data)
      .pipe(map((response) => response));
  }

  passwordReset(id: number, data: any) {
    return this.http
      .put<ApiResponse>(`${this.URL}PasswordReset/${id}`, data)
      .pipe(map((response) => response));
  }

  putStatus(id: number, estado: boolean) {
    return this.http
      .put<ApiResponse>(`${this.URL}${id}/${estado}`, null)
      .pipe(map((response) => response));
  }
}
