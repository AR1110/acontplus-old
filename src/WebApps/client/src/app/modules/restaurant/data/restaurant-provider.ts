import { Provider } from '@angular/core';
import { FloorRepository } from '@restaurant/data/repositories/floor.repository';
import { FloorWebService } from '@restaurant/data/floor/floor-web.service';
import { RoomRepository } from '@restaurant/data/repositories/room.repository';
import { RoomWebService } from '@restaurant/data/room/room-web.service';
import { TableRepository } from '@restaurant/data/repositories/table.repository';
import { TableWebService } from '@restaurant/data/table/table-web.service';
import { ItemRepository } from '@restaurant/data/repositories/item.repository';
import { ItemHttpRepository } from '@restaurant/data/https/item-http.repository';
import { MealScheduleSettingRepository } from '@restaurant/data/repositories/meal-schedule-setting.repository';
import { MealScheduleSettingHttpRepository } from '@restaurant/data/meal-schedule-setting/meal-schedule-setting-http-repository';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { MealConsumptionHttpRepository } from '@restaurant/data/meal-consumption/meal-consumption-http-repository';
import { PromotionRepository } from '@restaurant/data/repositories/promotion-repository';
import { PromotionHttpRepository } from '@restaurant/data/promotion/promotion-http-repository';
import { LookupRepository } from '@restaurant/data/repositories/lookup-repository';
import { LookupHttpRepository } from './lookup/lookup-http-repository';

export const DATA_RESTAURANT_IOC: Provider[] = [
  {
    provide: LookupRepository,
    useClass: LookupHttpRepository,
  },
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
    useClass: MealScheduleSettingHttpRepository,
  },
  {
    provide: MealConsumptionRepository,
    useClass: MealConsumptionHttpRepository,
  },
  {
    provide: PromotionRepository,
    useClass: PromotionHttpRepository,
  },
];
