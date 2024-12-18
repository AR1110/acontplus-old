import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { User } from "../../domain/models/user.model";
import { ApiResponse } from "@core/models/api-response";
import {PATHS_API} from "@core/constants/global.constants";
import {PATHS_AUTH} from "@modules/auth/domain/constants/auth.constants";

@Injectable({
  providedIn: 'root'
})
export class AuthWebRepository implements AuthRepository {
  private _url = `${PATHS_API.IDENTITY}${PATHS_AUTH.ACCOUNT}`;

  constructor(
    private http: HttpClient,
  ) {}

  login(credentials: { username: string, password: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this._url}login`, credentials);
  }

  register(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this._url}register`, user);
  }
}
