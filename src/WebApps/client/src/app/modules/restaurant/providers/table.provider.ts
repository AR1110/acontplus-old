import {FloorRepository} from "@restaurant/domain/repositories/floor.repository";
import {FloorUseCase} from "@restaurant/domain/use-cases/floor.use-case";
import {ClassProvider} from "@angular/core";
import {VehicleRepository} from "@mechanical/domain/repositories/vehicle.repository";
import {VehicleWebRepository} from "@mechanical/data/vehicle/vehicle-web.repository";
import {FloorWebService} from "@restaurant/data/floor/floor-web.service";
import {TableRepository} from "@restaurant/domain/repositories/table.repository";
import {TableUseCase} from "@restaurant/domain/use-cases/table.use-case";
import {TableWebService} from "@restaurant/data/table/table-web.service";


const tableUseCaseFactory = (repo: TableRepository) => new TableUseCase(repo);

export const tableUseCaseProvider = {
  provide: TableUseCase,
  useFactory: tableUseCaseFactory,
  deps: [TableRepository],
};

export const tableProvider : ClassProvider ={
  provide : TableRepository,
  useClass: TableWebService
}
