import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SeatRepository } from '@barber-shop/domain/repositories/seat.repository';
import { SeatUpdateParams } from '@barber-shop/domain/models/seat.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateSeatUseCase implements BaseUseCase<ApiResponseLegacy, SeatUpdateParams> {
  private repo = inject(SeatRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: SeatUpdateParams): Observable<ApiResponseLegacy<unknown>> {
    return this.repo.update(params);
  }
}
