import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { GeneralConfigRepository } from '@modules/config/data/repositories/general-config.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UpdateGeneralConfigUseCase<T> implements BaseUseCase<ApiResponseLegacy, T> {
  private repo = inject(GeneralConfigRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: T): Observable<ApiResponseLegacy> {
    return this.repo.update(params);
  }
}
