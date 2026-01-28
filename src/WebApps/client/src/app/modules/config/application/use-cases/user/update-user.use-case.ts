import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { User } from '@modules/config/data/models/user/user.model';
import { UserRepository } from '@modules/config/data/repositories/user.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserUseCase implements BaseUseCase<ApiResponseLegacy, User> {
  private repo = inject(UserRepository);
  execute(params: User): Observable<ApiResponseLegacy> {
    return this.repo.update(params);
  }
}
