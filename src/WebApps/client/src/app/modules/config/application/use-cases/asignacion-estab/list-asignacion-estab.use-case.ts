import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { AsignacionEstabResponse } from '@modules/config/data/models/user/asignacion-estab.model';
import { AsignacionEstabRepository } from '@modules/config/data/repositories/asignacion-estab.repository';

@Injectable({
  providedIn: 'root',
})
export class ListAsignacionEstabUseCase implements BaseUseCase<AsignacionEstabResponse, any> {
  private repo = inject(AsignacionEstabRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: { userRoleId: number }) {
    return this.repo.list(params);
  }
}
