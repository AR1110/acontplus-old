import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'acontplus-utils';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { withoutSpinner } from 'acontplus-ui-components';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private URL = CONFIG_PATHS.COMPANY;

  constructor(private http: HttpClient) {}

  get<T>(parameters: T) {
    return this.http
      .get<ApiResponse>(`${this.URL}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }

  search<T>(obj: T) {
    let json = JSON.stringify(obj);
    return this.http
      .get<ApiResponse>(`${this.URL}?json=${json}`, {
        context: withoutSpinner(),
      })
      .pipe(
        map((response) => {
          if (response && response.code == '1') {
            let { companies } = JSON.parse(response.payload as string);
            return companies || [];
          }
        }),
      );
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

  putStatus(id: number, estado: boolean) {
    return this.http
      .put<ApiResponse>(`${this.URL}${id}/${estado}`, null)
      .pipe(map((response) => response));
  }
}
