import { inject, Injectable } from '@angular/core';
import { InventoryAdjustmentRepository } from '@inventory/inventory-adjustment/domain/repositories/inventory-adjustment.repository';
import { map, Observable } from 'rxjs';

import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { InventoryAdjustmentFormDataMapper } from '@inventory/inventory-adjustment/infrastructure/mappers/inventory-adjustment-form-data.mapper';
import { InventoryAdjustmentListMapper } from '@inventory/inventory-adjustment/infrastructure/mappers/inventory-adjustment-list.mapper';
import { InventoryAdjustmentDetailMapper } from '@inventory/inventory-adjustment/infrastructure/mappers/inventory-adjustment-detail.mapper';
import { InventoryAdjustmentListProductsMapper } from '@inventory/inventory-adjustment/infrastructure/mappers/inventory-adjustment-list-products.mapper';
import { CreateInventoryAdjustmentCommand } from '@inventory/inventory-adjustment/domain/use-cases/create-inventory-adjustment.use-case';
import { ApiResponse } from '@core/models/api-response';
import { SaveInventoryAdjustmentMapper } from '@inventory/inventory-adjustment/infrastructure/mappers/save-inventory-adjustment.mapper';

@Injectable({
  providedIn: 'root',
})
export class InventoryAdjustmentRepositoryImpl implements InventoryAdjustmentRepository {
  #url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.INVENTORY_ADJUSTMENT}`;
  #http = inject(HttpClient);
  list(params: any) {
    const json = InventoryAdjustmentListMapper.toJson(params);
    return this.#http
      .get<any>(`${this.#url}?json=${json}`)
      .pipe(map((response) => InventoryAdjustmentListMapper.fromJson(response)));
  }

  formData() {
    const json = InventoryAdjustmentFormDataMapper.toJson();
    return this.#http
      .get<any>(`${this.#url}?json=${json}`)
      .pipe(map((response) => InventoryAdjustmentFormDataMapper.fromJson(response)));
  }

  detail(id: number) {
    const json = InventoryAdjustmentDetailMapper.toJson(id);
    return this.#http
      .get<any>(`${this.#url}?json=${json}`)
      .pipe(map((response) => InventoryAdjustmentDetailMapper.fromJson(response)));
  }

  listProducts(params: any) {
    const json = InventoryAdjustmentListProductsMapper.toJson(params);
    return this.#http
      .get<any>(`${this.#url}?json=${json}`)
      .pipe(map((response) => InventoryAdjustmentListProductsMapper.fromJson(response)));
  }

  create(params: CreateInventoryAdjustmentCommand): Observable<ApiResponse> {
    const data = SaveInventoryAdjustmentMapper.toJson(params);
    return this.#http.post<ApiResponse>(this.#url, data);
  }
}
