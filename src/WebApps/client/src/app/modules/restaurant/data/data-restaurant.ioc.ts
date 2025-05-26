import {Provider} from "@angular/core";
import {FloorRepository} from "@restaurant/domain/repositories/floor.repository";
import {FloorWebService} from "@restaurant/data/floor/floor-web.service";
import { RoomRepository } from "@restaurant/domain/repositories/room.repository";
import {RoomWebService} from "@restaurant/data/room/room-web.service";
import {TableRepository} from "@restaurant/domain/repositories/table.repository";
import {TableWebService} from "@restaurant/data/table/table-web.service";

export const DATA_RESTAURANT_IOC:Provider[] = [
  {
    provide: FloorRepository,
    useClass: FloorWebService
  },
  {
    provide: RoomRepository,
    useClass: RoomWebService
  },
  {
    provide: TableRepository,
    useClass: TableWebService
  }
];
