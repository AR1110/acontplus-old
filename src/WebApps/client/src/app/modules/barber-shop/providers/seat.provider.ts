
import {SeatRepository} from "@barber-shop/domain/repositories/seat.repository";
import {SeatRepositoryImpl} from "@barber-shop/data/seat/seat-repository-impl";

export const seatProvider = {
  provide: SeatRepository,
  useClass: SeatRepositoryImpl,
};
