import { Injectable } from '@angular/core';
import { TokenUseCase } from './token.use-case';
import { AuthRepository } from "../repositories/auth.repository";
import { User } from "../models/user.model";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthUseCase {
  constructor(
    private authRepository: AuthRepository,
    private tokenUseCase: TokenUseCase
  ) {}

  login(credentials: { username: string, password: string }) {
    return this.authRepository.login(credentials).pipe(
      tap(response => {
        if (response.code === "1") {
          const [mainData] = JSON.parse(response.payload as string);
          this.tokenUseCase.setToken(mainData.token);
        }
      })
    );
  }

  register(user: User) {
    return this.authRepository.register(user);
  }
}
