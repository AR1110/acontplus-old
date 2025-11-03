import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { GeneralConfigRepository } from '@modules/config/domain/repositories/general-config.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UpdateGeneralConfigUseCase<T> implements BaseUseCase<ApiResponse, T> {
  private repo = inject(GeneralConfigRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: T): Observable<ApiResponse> {
    return this.repo.update(params);
  }
}
