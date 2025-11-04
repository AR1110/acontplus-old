import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { AsignacionBodegaRepository } from '@modules/config/domain/repositories/asignacion-bodega.repository';
import { ApiResponse } from '@core/models/api-response';
import { AsignacionBodegaList } from '@modules/config/domain/models/user-customer/asignacion-bodega.model';

@Injectable({
  providedIn: 'root',
})
export class CreateAsignacionBodegaUseCase
  implements BaseUseCase<ApiResponse, Partial<AsignacionBodegaList>>
{
  private repo = inject(AsignacionBodegaRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<AsignacionBodegaList>): Observable<ApiResponse<unknown>> {
    return this.repo.create(params);
  }
}
