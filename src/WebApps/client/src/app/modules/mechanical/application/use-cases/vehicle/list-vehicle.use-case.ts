import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ListVehicleParams, ListVehicleResponse } from '@mechanical/domain/models/vehicle.model';
import { VehicleRepository } from '@mechanical/domain/repositories/vehicle.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListVehicleUseCase implements BaseUseCase<ListVehicleResponse, ListVehicleParams> {
  constructor(private repo: VehicleRepository) {}
  execute(params: ListVehicleParams): Observable<ListVehicleResponse> {
    return this.repo.getAll(params);
  }
}
