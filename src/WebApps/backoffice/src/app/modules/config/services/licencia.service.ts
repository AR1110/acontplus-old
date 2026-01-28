import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class LicenciaService {
  private URL = CONFIG_PATHS.LICENCIA;
  constructor(private http: HttpClient) {}

  getAll(parameters: string = JSON.stringify({ tipo: 1 })) {
    return this.http
      .get<ApiResponse>(`${this.URL}?json=${parameters}`)
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
}
