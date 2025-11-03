import { Injectable, inject } from '@angular/core';
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
  private repo = inject(ComprobanteEgresoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(): Observable<ComprobanteEgresoFilterResponse> {
    return this.repo.getFilterData();
  }
}
