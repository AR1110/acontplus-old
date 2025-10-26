import { PATHS_AUTH } from '@modules/auth/domain/constants/auth.constants';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse } from '@core/models/api-response';
import { User } from '../../domain/models/user.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthLoginMapper } from '@modules/auth/data/auth/auth-login.mapper';

@Injectable({
  providedIn: 'root',
})
export class AuthWebRepository implements AuthRepository {
  private _url = `${PATHS_API.IDENTITY}${PATHS_AUTH.ACCOUNT}`;
  private http = inject(HttpClient);

  login(credentials: { username: string; password: string }): Observable<{
    success: boolean;
    message: string;
    userRoles: any[];
    userRolesOriginal: any[];
  }> {
    return this.http.post<ApiResponse>(`${this._url}login`, credentials).pipe(
      map(response => {
        const result = {
          success: false,
          message: '',
          userRoles: [] as any[],
          userRolesOriginal: [] as any[],
        };

        if (response.code === '0') {
          result.message = response.message;
          return result;
        }

        const { userRoles, dto } = AuthLoginMapper.fromJson(response);

        result.success = true;
        result.message = response.message;
        result.userRoles = userRoles;
        result.userRolesOriginal = dto;

        return result;
      }),
    );
  }

  requestAccess(params: any) {
    return this.http.post<ApiResponse>(`${this._url}requestaccess`, params);
  }

  authenticate(params: any) {
    return this.http.post<ApiResponse>(`${this._url}authenticate`, params);
  }

  createToken(params: any) {
    return this.http.post<ApiResponse>(`${this._url}createtoken`, params).pipe(
      map(response => {
        const result = {
          success: false,
          message: '' as string ,
          userRoles: [] as any[],
          userRolesOriginal: [] as any[],
        };

        if (response.code === '0') {
          result.message = response.message;
          return result;
        }

        const { userRoles, dto } = AuthLoginMapper.fromJson(response);

        result.success = true;
        result.message = response.message;
        result.userRoles = userRoles;
        result.userRolesOriginal = dto;

        return result;
      }),
    );
  }

  register(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this._url}register`, user);
  }
}
