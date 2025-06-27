
import {inject, Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {InventoryAdjustmentRepository} from "@inventory/inventory-adjustment/domain/inventory-adjustment.repository";
import {Observable} from "rxjs";
import {
  InventoryAdjustmentListProductsResponse
} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentListProductsUseCase implements BaseUseCase<InventoryAdjustmentListProductsResponse, any>{
  execute(params: any): Observable<InventoryAdjustmentListProductsResponse> {
      return this.repo.listProducts(params)
  }
  private repo = inject(InventoryAdjustmentRepository)

}
