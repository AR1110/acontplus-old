import {inject, Injectable} from "@angular/core";
import {InventoryAdjustmentRepository} from "@inventory/inventory-adjustment/domain/inventory-adjustment.repository";
import {map, Observable} from "rxjs";
import {
  InventoryAdjustmentListResponse,
  InventoryAdjustmentFormDataResponse,
  InventoryAdjustmentDetailResponse
} from "../domain/inventory-adjustment.entity";
import {PATHS_API} from "@core/constants/global.constants";
import {INVENTORY_PATHS} from "@inventory/domain/enums/inventory.enum";
import {HttpClient} from "@angular/common/http";
import {
  InventoryAdjustmentFormDataMapper
} from "@inventory/inventory-adjustment/infrastructure/mappers/inventory-adjustment-form-data.mapper";
import {ApiResponse} from "@core/models/api-response";
import {
  InventoryAdjustmentListMapper
} from "@inventory/inventory-adjustment/infrastructure/mappers/inventory-adjustment-list.mapper";
import {
  InventoryAdjustmentDetailMapper
} from "@inventory/inventory-adjustment/infrastructure/mappers/inventory-adjustment-detail.mapper";

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentRepositoryImpl implements InventoryAdjustmentRepository {
   #url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.INVENTORY_ADJUSTMENT}`;
   #http = inject(HttpClient);
  list(params: any): Observable<InventoryAdjustmentListResponse> {
    const json = InventoryAdjustmentListMapper.toJson(params);
    return this.#http.get<any>(`${this.#url}?json=${json}`).pipe(
      map((response) => InventoryAdjustmentListMapper.fromJson(response))
    )
  }


  formData(): Observable<InventoryAdjustmentFormDataResponse> {
    const json = InventoryAdjustmentFormDataMapper.toJson();
    return this.#http.get<any>(`${this.#url}?json=${json}`).pipe(
      map((response) => InventoryAdjustmentFormDataMapper.fromJson(response))
    )
  }

  detail(id: number): Observable<InventoryAdjustmentDetailResponse> {
    const json = InventoryAdjustmentDetailMapper.toJson(id);
    return this.#http.get<any>(`${this.#url}?json=${json}`).pipe(
      map((response) => InventoryAdjustmentDetailMapper.fromJson(response))
    )
  }

}
