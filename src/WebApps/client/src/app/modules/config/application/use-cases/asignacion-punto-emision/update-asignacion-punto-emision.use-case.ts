import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { AsignacionPuntoEmisionList } from '@modules/config/domain/models/user-customer/asignacion-punto-emision.model';
import { AsignacionPuntoEmisionRepository } from '@modules/config/domain/repositories/asignacion-punto-emision.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateAsignacionPuntoEmisionUseCase
  implements BaseUseCase<ApiResponse, Partial<AsignacionPuntoEmisionList>>
{
  constructor(private repo: AsignacionPuntoEmisionRepository) {}

  execute(params: Partial<AsignacionPuntoEmisionList>): Observable<ApiResponse<unknown>> {
    return this.repo.update(params);
  }
}
