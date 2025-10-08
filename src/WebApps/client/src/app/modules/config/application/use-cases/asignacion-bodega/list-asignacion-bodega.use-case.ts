import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import {
  AsignacionBodegaList,
  AsignacionBodegaResponse,
} from '@modules/config/domain/models/user-customer/asignacion-bodega.model';
import { Observable } from 'rxjs';
import { AsignacionBodegaRepository } from '@modules/config/domain/repositories/asignacion-bodega.repository';

@Injectable({
  providedIn: 'root',
})
export class ListAsignacionBodegaUseCase
  implements BaseUseCase<AsignacionBodegaResponse, Partial<AsignacionBodegaList>>
{
  constructor(private repo: AsignacionBodegaRepository) {}

  execute(params: Partial<AsignacionBodegaList>): Observable<AsignacionBodegaResponse> {
    return this.repo.list(params);
  }
}
