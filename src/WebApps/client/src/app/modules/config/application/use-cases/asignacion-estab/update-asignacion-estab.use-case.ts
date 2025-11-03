import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { AsignacionEstabRepository } from '@modules/config/domain/repositories/asignacion-estab.repository';
import { ApiResponse } from '@core/models/api-response';
import { AsignacionEstabList } from '@modules/config/domain/models/user-customer/asignacion-estab.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateAsignacionEstabUseCase
  implements BaseUseCase<ApiResponse, Partial<AsignacionEstabList>>
{
  private repo = inject(AsignacionEstabRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.update(params);
  }
}
