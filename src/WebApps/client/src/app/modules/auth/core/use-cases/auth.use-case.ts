import { Injectable } from "@angular/core";
import {AuthRepository} from "@modules/auth/core/repositories/auth.repository";


@Injectable({
  providedIn: 'root'
})

export class AuthUseCase {
  constructor(private repo: AuthRepository) { }

  login(obj:{username: string, password: string}) {
    return this.repo.login(obj)
  }


}
