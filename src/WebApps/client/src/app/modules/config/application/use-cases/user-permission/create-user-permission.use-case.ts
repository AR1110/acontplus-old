import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UserPermissionRepository } from '@modules/config/data/repositories/user-permission.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateUserPermissionUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  constructor(private repo: UserPermissionRepository) {}

  execute(params: any) {
    return this.repo.create(params);
  }
}
