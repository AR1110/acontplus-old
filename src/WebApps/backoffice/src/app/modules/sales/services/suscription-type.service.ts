import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class SuscriptionTypeService {
  private URL = CONFIG_PATHS.SUBSCRIPTION_TYPE;
  constructor(private http: HttpClient) {}

  get() {
    return this.http
      .get<ApiResponse>(`${this.URL}`)
      .pipe(map((response: any) => response));
  }
  getById(id: number) {
    return this.http
      .get<ApiResponse>(`${this.URL}${id}`)
      .pipe(map((response: any) => response));
  }
  post(data: any) {
    console.log(data);
    return this.http
      .post<ApiResponse>(this.URL, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put<ApiResponse>(`${this.URL}${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.URL}${id}`)
      .pipe(map((response) => response));
  }
}
