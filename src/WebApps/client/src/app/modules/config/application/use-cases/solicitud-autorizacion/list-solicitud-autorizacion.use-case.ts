import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { SolicitudAutorizacionResponse } from '@modules/config/domain/models/solicitud-autorizacion.model';
import { SolicitudAutorizacionRepository } from '@modules/config/domain/repositories/solicitud-autorizacion.repository';

@Injectable({
  providedIn: 'root',
})
export class ListSolicitudAutorizacionUseCase
  implements BaseUseCase<SolicitudAutorizacionResponse, any>
{
  constructor(private repo: SolicitudAutorizacionRepository) {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
