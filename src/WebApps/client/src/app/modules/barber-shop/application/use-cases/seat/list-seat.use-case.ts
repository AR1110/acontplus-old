import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { SeatRepository } from '@barber-shop/domain/repositories/seat.repository';
import { SeatResponse } from '@barber-shop/domain/models/seat.model';

@Injectable({
  providedIn: 'root',
})
export class ListSeatUseCase implements BaseUseCase<SeatResponse, any> {
  constructor(private repo: SeatRepository) {}
  execute(params: any) {
    return this.repo.list();
  }
}
