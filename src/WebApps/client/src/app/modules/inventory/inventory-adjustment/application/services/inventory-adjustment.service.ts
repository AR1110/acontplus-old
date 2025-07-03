import {inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CreateInventoryAdjustmentCommand, CreateInventoryAdjustmentUseCase } from '../use-cases/create-inventory-adjustment.use-case';
import {
  AddDetailToAdjustmentCommand,
  AddDetailToAdjustmentUseCase
} from "@inventory/inventory-adjustment/application/use-cases/add-detail-to-adjustment.use-case";
import { GetAllInventoryAdjustmentsUseCase } from '../use-cases/get-all-inventory-adjustments.use-case';
import {ApiResponse} from "@core/models/api-response";
import {InventoryAdjustment} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";
import {
  InventoryAdjustmentFormDataUseCase
} from "@inventory/inventory-adjustment/application/use-cases/inventory-adjustment-form-data.use-case";

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentService {
  private createUseCase = inject(CreateInventoryAdjustmentUseCase);
  private getAllUseCase = inject(GetAllInventoryAdjustmentsUseCase);
  private addDetailUseCase = inject(AddDetailToAdjustmentUseCase);
  private formDataUseCase = inject(InventoryAdjustmentFormDataUseCase);

  constructor(
    // private createUseCase: CreateInventoryAdjustmentUseCase,
    // private getAllUseCase: GetAllInventoryAdjustmentsUseCase,
    // private getByIdUseCase: GetInventoryAdjustmentByIdUseCase,
    // private updateUseCase: UpdateInventoryAdjustmentUseCase,
    // private deleteUseCase: DeleteInventoryAdjustmentUseCase,
  //  private addDetailUseCase: AddDetailToAdjustmentUseCase,
    // private removeDetailUseCase: RemoveDetailFromAdjustmentUseCase,
    // private calculateImpactUseCase: CalculateInventoryImpactUseCase
  ) {}

  getFormData(){
    return this.formDataUseCase.execute()
  }

  // Main CRUD operations
  getAll(filters?: {
    pageIndex: number,
    pageSize: number,
    useFilterDate: boolean,
    startDate: string,
    endDate: string
    serie: string |null,
    tipoDocId?: number |null,
    textSearch?: string |null
  })  {
    return this.getAllUseCase.execute(filters);
  }

  // getById(id: number): Observable<InventoryAdjustment | null> {
  //   return this.getByIdUseCase.execute(id);
  // }

  create(command: CreateInventoryAdjustmentCommand)  {
    return this.createUseCase.execute(command);
  }

  // update(command: UpdateInventoryAdjustmentCommand): Observable<InventoryAdjustment> {
  //   return this.updateUseCase.execute(command);
  // }
  //
  // delete(id: number): Observable<void> {
  //   return this.deleteUseCase.execute(id);
  // }

  // Detail operations
  addDetail(command: AddDetailToAdjustmentCommand)  {
    return this.addDetailUseCase.execute(command);
  }

  // removeDetail(command: RemoveDetailFromAdjustmentCommand): Observable<InventoryAdjustment> {
  //   return this.removeDetailUseCase.execute(command);
  // }

  // Business operations
  // calculateInventoryImpact(adjustmentId: number): Observable<Map<number, Quantity>> {
  //   return this.calculateImpactUseCase.execute(adjustmentId);
  // }
}
