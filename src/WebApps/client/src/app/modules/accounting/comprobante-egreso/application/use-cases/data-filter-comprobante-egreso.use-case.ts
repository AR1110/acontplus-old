import { Injectable } from '@angular/core';
import { ComprobanteEgresoRepository } from '@accounting/comprobante-egreso/domain/comprobante-egreso.repository';
import { BaseUseCase } from '@core/base-use-case';
import { ComprobanteEgresoFilterResponse } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataFilterComprobanteEgresoUseCase
  implements BaseUseCase<ComprobanteEgresoFilterResponse, any>
{
  constructor(private repo: ComprobanteEgresoRepository) {}

  execute(): Observable<ComprobanteEgresoFilterResponse> {
    return this.repo.getFilterData();
  }
}
