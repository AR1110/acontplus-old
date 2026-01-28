import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PATHS_API } from '../constants/constants';

import { User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

export interface UserData {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly URL = `${PATHS_API.ACCOUNT}`;
  private readonly http = inject(HttpClient);
  public router = inject(Router);
  private readonly storageKey = environment.storageKey;

  getDecodedToken(): UserData | null {
    const jwt = this.getToken();
    if (jwt) {
      let token = jwtDecode<any>(jwt);
      const email =
        token[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ] || token.email;
      const name =
        token[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'
        ] || token.name;
      return {
        email: email,
        name: name,
      };
    }
    return null; // Return null if no JWT or something goes wrong
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  isAuthenticated = () => {
    const authToken = this.getToken();
    let expired = false;
    if (authToken !== null) {
      const decodedJwt = jwtDecode(authToken);
      const expiration = Number(decodedJwt.exp);
      const now = new Date();
      const currentTimeUTC = Math.floor(now.getTime() / 1000);
      if (expiration < currentTimeUTC) {
        expired = true;
      }
    } else {
      expired = true;
    }
    return !expired;
  };

  logout() {
    let removeToken = localStorage.removeItem(this.storageKey);
    if (removeToken == null) {
      this.router.navigate(['/', 'auth']);
    }
  }

  signUp(user: User): Observable<any> {
    return this.http
      .post(`${this.URL}register`, user)
      .pipe(map((response) => response));
  }

  signIn(user: User) {
    return this.http.post<any>(`${this.URL}login`, user).subscribe({
      next: (res) => {
        localStorage.setItem(this.storageKey, res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      },
      complete() {},
    });
  }
}
