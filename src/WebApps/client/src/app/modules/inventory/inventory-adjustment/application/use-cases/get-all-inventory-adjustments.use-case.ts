import { InventoryAdjustmentRepository } from "../../domain/repositories/inventory-adjustment.repository";
import {inject, Injectable} from "@angular/core";
import {getValidId, isValidField} from "@core/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class GetAllInventoryAdjustmentsUseCase {
  private repository = inject(InventoryAdjustmentRepository)


  execute(filters?: {
    pageIndex: number,
    pageSize: number,
    useFilterDate: boolean,
    startDate: string,
    endDate: string
    serie: string |null,
    tipoDocId?: number |null,
    textSearch?: string |null
  }) {
    return this.repository.list(filters)
  }


}
