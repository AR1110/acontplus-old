import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerRepository } from '@modules/config/domain/repositories/user-customer.repository';
import {
  SolicitudAutorizacionFilterResponse,
  SolicitudAutorizacionResponse,
} from '@modules/config/domain/models/solicitud-autorizacion.model';
import { SolicitudAutorizacionRepository } from '@modules/config/domain/repositories/solicitud-autorizacion.repository';

@Injectable({
  providedIn: 'root',
})
export class FilterSolicitudAutorizacionUseCase
  implements BaseUseCase<SolicitudAutorizacionFilterResponse, any>
{
  private repo = inject(SolicitudAutorizacionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute() {
    return this.repo.filter();
  }
}
