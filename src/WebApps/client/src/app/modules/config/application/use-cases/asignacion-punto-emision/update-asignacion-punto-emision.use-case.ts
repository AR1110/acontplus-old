import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { AsignacionPuntoEmisionList } from '@modules/config/data/models/user/asignacion-punto-emision.model';
import { AsignacionPuntoEmisionRepository } from '@modules/config/data/repositories/asignacion-punto-emision.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateAsignacionPuntoEmisionUseCase
  implements BaseUseCase<ApiResponseLegacy, Partial<AsignacionPuntoEmisionList>>
{
  private repo = inject(AsignacionPuntoEmisionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<AsignacionPuntoEmisionList>): Observable<ApiResponseLegacy<unknown>> {
    return this.repo.update(params);
  }
}
