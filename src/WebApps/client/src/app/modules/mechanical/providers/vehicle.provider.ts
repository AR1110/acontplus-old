import {ClassProvider} from "@angular/core";
import {VehicleRepository} from "@mechanical/domain/repositories/vehicle.repository";
import {VehicleWebRepository} from "@mechanical/data/vehicle/vehicle-web.repository";

export const vehicleProvider : ClassProvider ={
  provide : VehicleRepository,
  useClass: VehicleWebRepository
}
