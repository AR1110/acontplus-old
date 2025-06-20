import {inject, Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {InventoryAdjustmentListResponse} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";
import {InventoryAdjustmentRepository} from "@inventory/inventory-adjustment/domain/inventory-adjustment.repository";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentListUseCase implements BaseUseCase<InventoryAdjustmentListResponse, any>{
  private repo = inject(InventoryAdjustmentRepository)
  execute(params: any): Observable<InventoryAdjustmentListResponse> {
    return this.repo.list(params);
  }
}
