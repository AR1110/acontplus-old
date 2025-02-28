import { Injectable } from '@angular/core';
import { TokenRepository } from '../../domain/repositories/token.repository';
import { TokenModel } from '../../domain/models/token.model';
import { jwtDecode } from 'jwt-decode';
import { UserData } from '@modules/auth/domain/models/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class TokenLocalStorageRepository implements TokenRepository {
  private readonly TOKEN_KEY = 'access_token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // parseJwt(): TokenModel['decodedToken'] | null {
  //   try {
  //     const token = this.getToken();
  //     if (token) {
  //       return JSON.parse(atob(token.split('.')[1]));
  //     }
  //     return null;
  //   } catch (e) {
  //     return null;
  //   }
  // }
  parseJwt(): TokenModel['decodedToken'] | null {
    try {
      const token = this.getToken();
      if (token) {
        return jwtDecode<any>(token);
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getDecodedToken(): TokenModel['decodedToken'] | null {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  getUserRoleId(): number {
    const decodedToken = this.parseJwt();
    if (!decodedToken?.userRoleId) {
      throw new Error('Not found userRoleId');
    }
    return decodedToken.userRoleId;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken = jwtDecode<TokenModel['decodedToken']>(token);
    const expiration = Number(decodedToken.exp);
    const now = Math.floor(Date.now() / 1000);

    return expiration < now;
  }

  getUserData(): UserData | null {
    const jwt = this.getToken();
    if (jwt) {
      const token = jwtDecode<any>(jwt);
      return {
        email: token.email || '',
        name:
          token[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'
          ] || token.name,
        userId:
          token[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
          ] || token.userId,
        username: token.unique_name || '',
      };
    }
    return null;
  }
}
