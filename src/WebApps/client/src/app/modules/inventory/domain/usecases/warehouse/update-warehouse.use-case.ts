import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { WarehouseRepository } from '@inventory/domain/repositories/warehouse.repository';
import { WarehouseList } from '@inventory/domain/models/warehouse.model';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UpdateWarehouseUseCase implements BaseUseCase<ApiResponse, Partial<WarehouseList>> {
  constructor(private repo: WarehouseRepository) {}
  execute(params: Partial<WarehouseList>) {
    return this.repo.update(params);
  }
}
