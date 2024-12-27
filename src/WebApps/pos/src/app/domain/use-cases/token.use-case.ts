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

  setUserData<T>(data:T){
    return this.tokenRepository.setUserData(data);
  }

  getUserData(){
    return this.tokenRepository.getUserData();
  }

  setDataEstab<T>(data:T){
    return this.tokenRepository.setDataEstab(data);
  }

  getDataEstab(){
    return this.tokenRepository.getDataEstab()
  }

  removeAllStorage(){
    return this.tokenRepository.removeAllStorage()
  }
}
