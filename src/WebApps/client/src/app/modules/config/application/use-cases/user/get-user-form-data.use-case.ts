import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserDataForm } from '@modules/config/data/models/user/user.model';
import { UserRepository } from '@modules/config/data/repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class GetUserFormDataUseCase implements BaseUseCase<UserDataForm, void> {
  private repo = inject(UserRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute() {
    return this.repo.dataForm();
  }
}
