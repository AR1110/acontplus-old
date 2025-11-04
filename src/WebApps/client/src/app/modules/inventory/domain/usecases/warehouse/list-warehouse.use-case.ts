import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { WarehouseRepository } from '@inventory/domain/repositories/warehouse.repository';
import { ListWarehouseResponse } from '@inventory/domain/models/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class ListWarehouseUseCase implements BaseUseCase<ListWarehouseResponse, any> {
  private repo = inject(WarehouseRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(params: any) {
    return this.repo.list(params);
  }
}
