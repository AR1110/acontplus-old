import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { GeneralConfigRepository } from '@modules/config/domain/repositories/general-config.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UpdateGeneralConfigUseCase<T> implements BaseUseCase<ApiResponse, T> {
  constructor(private repo: GeneralConfigRepository) {}

  execute(params: T): Observable<ApiResponse> {
    return this.repo.update(params);
  }
}
