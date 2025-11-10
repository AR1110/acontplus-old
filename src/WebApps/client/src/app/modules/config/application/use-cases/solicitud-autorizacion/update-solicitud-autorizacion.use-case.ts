import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { SolicitudAutorizacionUpdateParams } from '@modules/config/domain/models/solicitud-autorizacion.model';
import { SolicitudAutorizacionRepository } from '@modules/config/domain/repositories/solicitud-autorizacion.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UpdateSolicitudAutorizacionUseCase
  implements BaseUseCase<ApiResponseLegacy, SolicitudAutorizacionUpdateParams>
{
  private repo = inject(SolicitudAutorizacionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: SolicitudAutorizacionUpdateParams) {
    return this.repo.update(params);
  }
}
