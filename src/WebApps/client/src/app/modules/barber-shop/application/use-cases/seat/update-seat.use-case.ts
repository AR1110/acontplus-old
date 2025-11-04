import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { SeatRepository } from '@barber-shop/domain/repositories/seat.repository';
import { SeatUpdateParams } from '@barber-shop/domain/models/seat.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateSeatUseCase implements BaseUseCase<ApiResponse, SeatUpdateParams> {
  private repo = inject(SeatRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: SeatUpdateParams): Observable<ApiResponse<unknown>> {
    return this.repo.update(params);
  }
}
