import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'acontplus-utils';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '@modules/common/constants/common.constants';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  #http = inject(HttpClient);
  #url = `${API_ENDPOINTS.TAG}`;
  get() {
    return this.#http.get<ApiResponse>(`${this.#url}`).pipe(
      map((response) => {
        if (response.code != '1') {
          return { userManuals: [] };
        }
        return { userManuals: response.payload || [] };
      }),
    );
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponse>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponse>(`${this.#url}${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number) {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }
}
