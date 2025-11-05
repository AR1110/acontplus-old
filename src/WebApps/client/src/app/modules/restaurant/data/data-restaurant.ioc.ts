import { Provider } from '@angular/core';
import { FloorRepository } from '@restaurant/domain/repositories/floor.repository';
import { FloorWebService } from '@restaurant/data/floor/floor-web.service';
import { RoomRepository } from '@restaurant/domain/repositories/room.repository';
import { RoomWebService } from '@restaurant/data/room/room-web.service';
import { TableRepository } from '@restaurant/domain/repositories/table.repository';
import { TableWebService } from '@restaurant/data/table/table-web.service';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';
import { ItemHttpRepository } from '@restaurant/data/item/item-http.repository';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import { MealScheduleSettingWebService } from '@restaurant/data/meal-schedule-setting/meal-schedule-setting-web.service';

export const DATA_RESTAURANT_IOC: Provider[] = [
  {
    provide: ItemRepository,
    useClass: ItemHttpRepository,
  },
  {
    provide: FloorRepository,
    useClass: FloorWebService,
  },
  {
    provide: RoomRepository,
    useClass: RoomWebService,
  },
  {
    provide: TableRepository,
    useClass: TableWebService,
  },
  {
    provide: MealScheduleSettingRepository,
    useClass: MealScheduleSettingWebService,
  },
];
