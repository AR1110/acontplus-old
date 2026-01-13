import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import {
  AsignacionPuntoEmisionList,
  AsignacionPuntoEmisionResponse,
} from '@modules/config/data/models/user-customer/asignacion-punto-emision.model';
import { AsignacionPuntoEmisionRepository } from '@modules/config/data/repositories/asignacion-punto-emision.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListAsignacionPuntoEmisionUseCase
  implements BaseUseCase<AsignacionPuntoEmisionResponse, Partial<AsignacionPuntoEmisionList>>
{
  private repo = inject(AsignacionPuntoEmisionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<AsignacionPuntoEmisionList>): Observable<AsignacionPuntoEmisionResponse> {
    return this.repo.list(params);
  }
}
