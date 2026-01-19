import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {CONFIG_PATHS} from "@modules/config/enums/config.enum";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL = CONFIG_PATHS.USER;
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<ApiResponse>(this.URL, {
      params: {
        json: JSON.stringify({ tipo: 1 })
      }
    }).pipe(map((response: any) => response.enterprises))
  }

  post(data: any) {
    return this.http.post<ApiResponse>(this.URL, data)
      .pipe(map(response => response))
  }

  put(id: number, data: any) {
    return this.http.put<ApiResponse>(`${this.URL}${id}`, data)
      .pipe(map(response => response))
  }

}
