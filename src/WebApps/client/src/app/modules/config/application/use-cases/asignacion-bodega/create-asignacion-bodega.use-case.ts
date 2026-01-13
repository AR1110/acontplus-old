import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { AsignacionBodegaRepository } from '@modules/config/data/repositories/asignacion-bodega.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { AsignacionBodegaList } from '@modules/config/data/models/user-customer/asignacion-bodega.model';

@Injectable({
  providedIn: 'root',
})
export class CreateAsignacionBodegaUseCase
  implements BaseUseCase<ApiResponseLegacy, Partial<AsignacionBodegaList>>
{
  private repo = inject(AsignacionBodegaRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<AsignacionBodegaList>): Observable<ApiResponseLegacy<unknown>> {
    return this.repo.create(params);
  }
}
