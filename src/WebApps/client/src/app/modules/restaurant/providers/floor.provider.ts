import {FloorRepository} from "@restaurant/domain/repositories/floor.repository";
import {FloorUseCase} from "@restaurant/domain/use-cases/floor.use-case";
import {ClassProvider} from "@angular/core";
import {VehicleRepository} from "@mechanical/domain/repositories/vehicle.repository";
import {VehicleWebRepository} from "@mechanical/data/vehicle/vehicle-web.repository";
import {FloorWebService} from "@restaurant/data/floor/floor-web.service";


const floorUseCaseFactory = (userRepo: FloorRepository) => new FloorUseCase(userRepo);

export const userLoginUseCaseProvider = {
  provide: FloorUseCase,
  useFactory: floorUseCaseFactory,
  deps: [FloorRepository],
};

export const floorProvider : ClassProvider ={
  provide : FloorRepository,
  useClass: FloorWebService
}
