import { InventoryAdjustmentRepository } from "../repositories/inventory-adjustment.repository";
import {inject, Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {Observable} from "rxjs";
import {
  InventoryAdjustmentDetailDto,
  InventoryAdjustmentFormDataDto,
  InventoryAdjustmentListProductsDto
} from "@inventory/inventory-adjustment/domain/dtos/inventory-adjustment.dto";

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


//Detail
@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentDetailUseCase implements BaseUseCase<InventoryAdjustmentDetailDto, number>{
  private repo = inject(InventoryAdjustmentRepository)
  execute(id: number): Observable<InventoryAdjustmentDetailDto> {
    return this.repo.detail(id);
  }
}


//Form data
@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentFormDataUseCase implements BaseUseCase<InventoryAdjustmentFormDataDto, any>{
  private repo = inject(InventoryAdjustmentRepository)
  execute(): Observable<InventoryAdjustmentFormDataDto> {
    return this.repo.formData();
  }
}


//Listado de productos importados
@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentListProductsUseCase implements BaseUseCase<InventoryAdjustmentListProductsDto, any>{
  private repo = inject(InventoryAdjustmentRepository);

  execute(params: any): Observable<InventoryAdjustmentListProductsDto> {
    return this.repo.listProducts(params)
  }

}
