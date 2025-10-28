import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { AsignacionEstabResponse } from '@modules/config/domain/models/user-customer/asignacion-estab.model';
import { AsignacionEstabRepository } from '@modules/config/domain/repositories/asignacion-estab.repository';

@Injectable({
  providedIn: 'root',
})
export class ListAsignacionEstabUseCase implements BaseUseCase<AsignacionEstabResponse, any> {
  constructor(private repo: AsignacionEstabRepository) {}

  execute(params: { userRoleId: number }) {
    return this.repo.list(params);
  }
}
