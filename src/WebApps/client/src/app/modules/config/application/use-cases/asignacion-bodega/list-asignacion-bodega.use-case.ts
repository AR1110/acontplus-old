import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import {
  AsignacionBodegaList,
  AsignacionBodegaResponse,
} from '@modules/config/data/models/user/asignacion-bodega.model';
import { Observable } from 'rxjs';
import { AsignacionBodegaRepository } from '@modules/config/data/repositories/asignacion-bodega.repository';

@Injectable({
  providedIn: 'root',
})
export class ListAsignacionBodegaUseCase
  implements BaseUseCase<AsignacionBodegaResponse, Partial<AsignacionBodegaList>>
{
  private repo = inject(AsignacionBodegaRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<AsignacionBodegaList>): Observable<AsignacionBodegaResponse> {
    return this.repo.list(params);
  }
}
