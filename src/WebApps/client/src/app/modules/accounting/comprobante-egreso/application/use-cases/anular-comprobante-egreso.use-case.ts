import { Injectable, inject } from '@angular/core';
import { ComprobanteEgresoRepository } from '@accounting/comprobante-egreso/domain/comprobante-egreso.repository';
import { BaseUseCase } from '@core/base-use-case';
import { ComprobanteEgresoDeleteParams } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class AnularComprobanteEgresoUseCase
  implements BaseUseCase<ApiResponse, ComprobanteEgresoDeleteParams>
{
  private repo = inject(ComprobanteEgresoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: ComprobanteEgresoDeleteParams): Observable<ApiResponse> {
    return this.repo.anular(params);
  }
}
