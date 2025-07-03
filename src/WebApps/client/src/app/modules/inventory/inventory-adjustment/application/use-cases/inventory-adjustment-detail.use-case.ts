
import {inject, Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {InventoryAdjustmentRepository} from "@inventory/inventory-adjustment/domain/repositories/inventory-adjustment.repository";
import {Observable} from "rxjs";
import {InventoryAdjustmentDetailResponse} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentDetailUseCase implements BaseUseCase<InventoryAdjustmentDetailResponse, number>{
  private repo = inject(InventoryAdjustmentRepository)
  execute(id: number): Observable<InventoryAdjustmentDetailResponse> {
    return this.repo.detail(id);
  }
}
