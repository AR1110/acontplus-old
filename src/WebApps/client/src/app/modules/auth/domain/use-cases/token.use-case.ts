import { inject, Injectable } from '@angular/core';
import { TokenRepository } from '../repositories/token.repository';
import { SessionCache } from '@modules/auth/domain/models/session';

@Injectable({
  providedIn: 'root',
})
export class TokenUseCase {
  private tokenRepository = inject(TokenRepository);
  saveSession(session: SessionCache) {
    this.tokenRepository.saveSession(session);
  }

  getSession() {
    return this.tokenRepository.getSession();
  }

  getToken() {
    return this.tokenRepository.getToken();
  }

  setToken(token: string) {
    this.tokenRepository.setToken(token);
  }

  removeToken() {
    this.tokenRepository.removeToken();
  }

  getUserRoleId() {
    return this.tokenRepository.getUserRoleId();
  }

  isTokenExpired() {
    return this.tokenRepository.isTokenExpired();
  }

  parseJwt() {
    return this.tokenRepository.parseJwt();
  }

  getUserData() {
    return this.tokenRepository.getUserData();
  }

  clear() {
    this.tokenRepository.clear();
  }
}
