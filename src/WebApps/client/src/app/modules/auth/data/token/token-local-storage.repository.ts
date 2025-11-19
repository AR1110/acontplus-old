import { TokenRepository } from '../../domain/repositories/token.repository';
import { UserData } from '@modules/auth/domain/models/user-data.model';
import { TokenModel } from '../../domain/models/token.model';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { SessionCache } from '@modules/auth/domain/models/session';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenLocalStorageRepository implements TokenRepository {
  private readonly CACHE_VERSION = '1.0.0';
  private readonly CACHE_DURATION = 3600000; // 1 hora
  private readonly SESSION_KEY = 'session';

  saveSession(session: SessionCache): void {
    localStorage.setItem(environment.tokenKey, session.token);
    localStorage.setItem(
      this.SESSION_KEY,
      JSON.stringify({
        userData: session.userData,
        menuItems: session.menuItems,
        permissions: session.permissions,
        company: session.company,
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
      }),
    );
  }

  getSession(): SessionCache | null {
    const data = localStorage.getItem(this.SESSION_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...parsed, token: this.getToken()! };
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(environment.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(environment.tokenKey);
  }
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
          token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || token.name,
        userId:
          token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
          token.userId,
        username: token.unique_name || '',
        codeRole: token.codeRole || '',
      };
    }
    return null;
  }

  clear(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(this.SESSION_KEY);
    location.reload();
  }
}
