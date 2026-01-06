import { Provider } from '@angular/core';
import { FloorRepository } from '@restaurant/domain/repositories/floor.repository';
import { FloorWebService } from '@restaurant/data/floor/floor-web.service';
import { RoomRepository } from '@restaurant/domain/repositories/room.repository';
import { RoomWebService } from '@restaurant/data/room/room-web.service';
import { TableRepository } from '@restaurant/domain/repositories/table.repository';
import { TableWebService } from '@restaurant/data/table/table-web.service';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';
import { ItemHttpRepository } from '@restaurant/data/https/item-http.repository';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import { MealScheduleSettingHttpRepository } from '@restaurant/data/meal-schedule-setting/meal-schedule-setting-http-repository';
import { MealConsumptionRepository } from '@restaurant/domain/repositories/meal-consumption-repository';
import { MealConsumptionHttpRepository } from '@restaurant/data/meal-consumption/meal-consumption-http-repository';
import { PromotionRepository } from '@restaurant/domain/repositories/promotion-repository';
import { PromotionHttpRepository } from '@restaurant/data/promotion/promotion-http-repository';
import { LookupRepository } from '@restaurant/domain/repositories/lookup-repository';
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
