import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { SolicitudAutorizacionResponse } from '@modules/config/domain/models/solicitud-autorizacion.model';
import { SolicitudAutorizacionRepository } from '@modules/config/domain/repositories/solicitud-autorizacion.repository';

@Injectable({
  providedIn: 'root',
})
export class ListSolicitudAutorizacionUseCase
  implements BaseUseCase<SolicitudAutorizacionResponse, any>
{
  private repo = inject(SolicitudAutorizacionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
