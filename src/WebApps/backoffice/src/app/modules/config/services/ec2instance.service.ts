import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse, customUrl } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class Ec2instanceService {
  private URL = CONFIG_PATHS.EC2INSTANCE;

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

  startStop(url: string) {
    return this.http
      .post<ApiResponse>(
        url,
        {},
        {
          context: customUrl(),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(map((response) => response));
  }
}
