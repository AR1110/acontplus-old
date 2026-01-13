import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { AsignacionEstabRepository } from '@modules/config/data/repositories/asignacion-estab.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { AsignacionEstabList } from '@modules/config/data/models/user-customer/asignacion-estab.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateAsignacionEstabUseCase
  implements BaseUseCase<ApiResponseLegacy, Partial<AsignacionEstabList>>
{
  private repo = inject(AsignacionEstabRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.update(params);
  }
}
