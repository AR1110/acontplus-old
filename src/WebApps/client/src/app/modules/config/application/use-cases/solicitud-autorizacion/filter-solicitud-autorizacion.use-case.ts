import { Injectable } from '@angular/core';
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
  constructor(private repo: SolicitudAutorizacionRepository) {}

  execute() {
    return this.repo.filter();
  }
}
