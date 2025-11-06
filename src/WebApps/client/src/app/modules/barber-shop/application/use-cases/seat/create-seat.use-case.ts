import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { SeatRepository } from '@barber-shop/domain/repositories/seat.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SeatCreateDto } from '@barber-shop/domain/models/seat.model';

@Injectable({
  providedIn: 'root',
})
export class CreateSeatUseCase implements BaseUseCase<ApiResponseLegacy, SeatCreateDto> {
  private repo = inject(SeatRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: SeatCreateDto): Observable<ApiResponseLegacy<unknown>> {
    return this.repo.create(params);
  }
}
