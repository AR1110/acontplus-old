import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponse } from '@core/models/api-response';
import { AsignacionEstabRepository } from '@modules/config/domain/repositories/asignacion-estab.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateAsignacionEstabUseCase implements BaseUseCase<ApiResponse, any> {
  private repo = inject(AsignacionEstabRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.create(params);
  }
}
