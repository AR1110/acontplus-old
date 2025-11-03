import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { SolicitudAutorizacionUpdateParams } from '@modules/config/domain/models/solicitud-autorizacion.model';
import { SolicitudAutorizacionRepository } from '@modules/config/domain/repositories/solicitud-autorizacion.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UpdateSolicitudAutorizacionUseCase
  implements BaseUseCase<ApiResponse, SolicitudAutorizacionUpdateParams>
{
  private repo = inject(SolicitudAutorizacionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: SolicitudAutorizacionUpdateParams) {
    return this.repo.update(params);
  }
}
