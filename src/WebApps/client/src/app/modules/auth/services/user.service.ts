import { Injectable, inject } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { PATHS_AUTH } from '../constants/auth.constants';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.IDENTITY}${PATHS_AUTH.USER}`;

  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }
  get(params: any) {
    return this.http
      .get(`${this.url}?json=${params}`)
      .pipe(map((response) => response));
  }
  post(data: any) {
    return this.http
      .post(`${this.url}`, data)
      .pipe(map((response) => response));
  }
  put(id: number, data: any) {
    return this.http
      .post(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
