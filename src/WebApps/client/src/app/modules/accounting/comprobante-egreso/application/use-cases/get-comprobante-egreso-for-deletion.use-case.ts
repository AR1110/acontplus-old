import { Injectable, inject } from '@angular/core';
import { ComprobanteEgresoRepository } from '@accounting/comprobante-egreso/domain/comprobante-egreso.repository';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ComprobanteEgresoDeleteResponse } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';

@Injectable({
  providedIn: 'root',
})
export class GetComprobanteEgresoForDeletionUseCase
  implements BaseUseCase<ComprobanteEgresoDeleteResponse, number>
{
  private repo = inject(ComprobanteEgresoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: number): Observable<ComprobanteEgresoDeleteResponse> {
    return this.repo.getDataForDeletion(params);
  }
}
