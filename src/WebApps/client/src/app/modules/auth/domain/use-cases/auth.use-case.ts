import { Injectable } from '@angular/core';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase {
  constructor(private authRepository: AuthRepository) {}

  login(credentials: { username: string; password: string; userAgent: string }) {
    return this.authRepository.login(credentials);
  }

  register(user: User) {
    return this.authRepository.register(user);
  }
  requestAccess(params: any) {
    return this.authRepository.requestAccess(params);
  }

  authenticate(params: any) {
    return this.authRepository.authenticate(params);
  }

  createToken(params: any) {
    return this.authRepository.createToken(params);
  }
}
