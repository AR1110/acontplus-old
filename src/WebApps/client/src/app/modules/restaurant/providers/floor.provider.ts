import {FloorRepository} from "@restaurant/domain/repositories/floor.repository";
import {FloorUseCase} from "@restaurant/domain/use-cases/floor.use-case";
import {ClassProvider} from "@angular/core";
import {FloorWebService} from "@restaurant/data/floor/floor-web.service";


const floorUseCaseFactory = (userRepo: FloorRepository) => new FloorUseCase(userRepo);

export const floorUseCaseProvider = {
  provide: FloorUseCase,
  useFactory: floorUseCaseFactory,
  deps: [FloorRepository],
};

export const floorProvider : ClassProvider ={
  provide : FloorRepository,
  useClass: FloorWebService
}
