import { Injectable } from '@angular/core';
import { tap } from "rxjs";
import {AuthRepository} from "@domain/repositories/auth.repository";

@Injectable({
  providedIn: 'root'
})
export class AuthUseCase {
  constructor(
    private authRepository: AuthRepository,
  ) {}

  login(credentials: { username: string, password: string }) {
    return this.authRepository.login(credentials).pipe(
      tap(response => {
       /**  if (response.code === "1") {
          const [mainData] = JSON.parse(response.payload as string);
          this.tokenUseCase.setToken(mainData.token);
        }*/
      })
    );
  }


  createToken<T>(obj:T){
    return this.authRepository.createToken(obj);
  }
}
