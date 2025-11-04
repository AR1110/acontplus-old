import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { WarehouseRepository } from '@inventory/domain/repositories/warehouse.repository';
import { WarehouseList } from '@inventory/domain/models/warehouse.model';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CreateWarehouseUseCase implements BaseUseCase<ApiResponse, Partial<WarehouseList>> {
  private repo = inject(WarehouseRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(params: Partial<WarehouseList>) {
    return this.repo.create(params);
  }
}
