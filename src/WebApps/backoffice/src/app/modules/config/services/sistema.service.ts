import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class SistemaService {
  private URL = CONFIG_PATHS.SISTEMA;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<ApiResponse>(this.URL)
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
}
