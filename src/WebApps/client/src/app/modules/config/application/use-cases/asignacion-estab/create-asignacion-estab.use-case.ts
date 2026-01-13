import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { AsignacionEstabRepository } from '@modules/config/data/repositories/asignacion-estab.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateAsignacionEstabUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(AsignacionEstabRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.create(params);
  }
}
