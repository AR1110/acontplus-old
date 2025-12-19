import { inject, Injectable } from '@angular/core';
import { InventoryAdjustmentRepository } from '@inventory/domain/interfaces/inventory-adjustment.repository';
import { map, Observable } from 'rxjs';

import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import {
  InventoryAdjustmentFormDataMapper,
  InventoryAdjustmentListMapper,
  InventoryAdjustmentDetailMapper,
  InventoryAdjustmentListProductsMapper,
  SaveInventoryAdjustmentMapper,
} from '@inventory/data/mappers/inventory-adjustment.mapper';
import { CreateInventoryAdjustmentCommand } from '@inventory/domain/models/inventory-adjustment.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class InventoryAdjustmentHttp implements InventoryAdjustmentRepository {
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
      .get<unknown>(`${this.#url}?json=${json}`)
      .pipe(map((response) => InventoryAdjustmentListProductsMapper.fromJson(response)));
  }

  create(params: CreateInventoryAdjustmentCommand): Observable<ApiResponseLegacy> {
    const data = SaveInventoryAdjustmentMapper.toJson(params);
    return this.#http.post<ApiResponseLegacy>(this.#url, data);
  }
}
