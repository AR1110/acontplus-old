import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { AsignacionPuntoEmisionRepository } from '@modules/config/data/repositories/asignacion-punto-emision.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { AsignacionPuntoEmisionList } from '@modules/config/data/models/user-customer/asignacion-punto-emision.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateAsignacionPuntoEmisionUseCase
  implements BaseUseCase<ApiResponseLegacy, Partial<AsignacionPuntoEmisionList>>
{
  private repo = inject(AsignacionPuntoEmisionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<AsignacionPuntoEmisionList>): Observable<ApiResponseLegacy<unknown>> {
    return this.repo.create(params);
  }
}
