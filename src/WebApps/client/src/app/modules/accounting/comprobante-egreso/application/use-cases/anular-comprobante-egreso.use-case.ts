import { Injectable, inject } from '@angular/core';
import { ComprobanteEgresoRepository } from '@accounting/comprobante-egreso/domain/comprobante-egreso.repository';
import { BaseUseCase } from '@core/base-use-case';
import { ComprobanteEgresoDeleteParams } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class AnularComprobanteEgresoUseCase
  implements BaseUseCase<ApiResponseLegacy, ComprobanteEgresoDeleteParams>
{
  private repo = inject(ComprobanteEgresoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: ComprobanteEgresoDeleteParams): Observable<ApiResponseLegacy> {
    return this.repo.anular(params);
  }
}
