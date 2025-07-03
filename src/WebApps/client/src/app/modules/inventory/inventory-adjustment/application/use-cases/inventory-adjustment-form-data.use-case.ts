import {inject, Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {InventoryAdjustmentFormDataResponse} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";
import {InventoryAdjustmentRepository} from "@inventory/inventory-adjustment/domain/repositories/inventory-adjustment.repository";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentFormDataUseCase implements BaseUseCase<InventoryAdjustmentFormDataResponse, any>{
  private repo = inject(InventoryAdjustmentRepository)
  execute(): Observable<InventoryAdjustmentFormDataResponse> {
    return this.repo.formData();
  }
}
