import { inject, Injectable } from '@angular/core';
import { UserManualRepository } from '@modules/common/core/repositories/user-manual.repository';

@Injectable({
  providedIn: 'root',
})
export class UserManualUseCase {
  private readonly _userManualRepository = inject(UserManualRepository);
  get<T>(parameters: T) {
    return this._userManualRepository.get<T>(parameters);
  }
}
