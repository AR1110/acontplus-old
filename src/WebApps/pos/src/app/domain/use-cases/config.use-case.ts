import { Injectable } from '@angular/core';
import { tap } from "rxjs";
import {AuthRepository} from "@domain/repositories/auth.repository";
import {ConfigRepository} from "@domain/repositories/config.repository";

@Injectable({
  providedIn: 'root'
})
export class ConfigUseCase {
  constructor(
    private repo: ConfigRepository,
  ) {}

  getEstabs() {
     return this.repo.getEstabs()
  }

  getDataForm<T extends { codEstab: string }>(obj: T){
    return this.repo.getDataForm(obj)
  }
}
