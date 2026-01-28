import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserListResponse } from '@modules/config/data/models/user/user.model';
import { UserRepository } from '@modules/config/data/repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class ListUserUseCase implements BaseUseCase<UserListResponse, any> {
  private repo = inject(UserRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
