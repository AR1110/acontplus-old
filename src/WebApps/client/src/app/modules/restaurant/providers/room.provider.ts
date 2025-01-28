
import {ClassProvider} from "@angular/core";
import {RoomRepository} from "@restaurant/domain/repositories/room.repository";
import {RoomUseCase} from "@restaurant/domain/use-cases/room.use-case";
import {RoomWebService} from "@restaurant/data/room/room-web.service";


const roomUseCaseFactory = (userRepo: RoomRepository) => new RoomUseCase(userRepo);

export const roomUseCaseProvider = {
  provide: RoomUseCase,
  useFactory: roomUseCaseFactory,
  deps: [RoomRepository],
};

export const roomProvider : ClassProvider ={
  provide : RoomRepository,
  useClass: RoomWebService
}
