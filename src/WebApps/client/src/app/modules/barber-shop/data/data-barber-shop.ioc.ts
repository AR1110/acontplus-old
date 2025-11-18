import { Provider } from '@angular/core';
import { SeatRepository } from '@barber-shop/domain/repositories/seat.repository';
import { SeatRepositoryImpl } from '@barber-shop/data/seat/seat-repository-impl';

export const DATA_BARBER_SHOP_IOC: Provider[] = [
  {
    provide: SeatRepository,
    useClass: SeatRepositoryImpl,
  },
];
