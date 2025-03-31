import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PATHS, PATHS_API } from '@domain/enums/main.enum';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { ApiResponse } from '@domain/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class AuthWebRepository implements AuthRepository {
  private _url = `${PATHS_API.SECURITY}${PATHS.ACCOUNT}`;

  constructor(private http: HttpClient) {}

  login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Observable<ApiResponse> {
    const url = `${this._url}login`;
    const userAgent = JSON.stringify({
      application: 'Restaurant',
      browser: navigator.userAgent,
    });
    const body = {
      username,
      password,
      userAgent,
      external: true,
    };
    return this.http.post<ApiResponse>(`${url}`, body);
  }

  createToken<T>(data: T) {
    return this.http.post<ApiResponse>(`${this._url}createToken`, data);
  }
}
