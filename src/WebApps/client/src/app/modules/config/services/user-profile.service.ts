import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { CONFIG_PATHS } from '@modules/config/config-const';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_PROFILE}`;
  private http = inject(HttpClient);

  getAll<T>(data: T) {
    return this.http.get(`${this.url}?json=${JSON.stringify(data)}`);
  }

  post<T>(data: T) {
    return this.http.post(`${this.url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this.http.put(`${this.url}${id}`, { data });
  }
}
