import { Injectable } from '@angular/core';
import { TokenRepository } from '../repositories/token.repository';

@Injectable({
  providedIn: 'root'
})
export class TokenUseCase {
  constructor(private tokenRepository: TokenRepository) {}

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

  getUserData(){
    return this.tokenRepository.getUserData();
  }

}
