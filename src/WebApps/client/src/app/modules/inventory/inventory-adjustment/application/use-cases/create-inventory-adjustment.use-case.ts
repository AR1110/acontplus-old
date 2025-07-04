import {inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {InventoryAdjustment} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";
import {Quantity} from "@inventory/inventory-adjustment/domain/value-objects/quantity.vo";
import {Money} from "@inventory/inventory-adjustment/domain/value-objects/money.vo";
import {
  InventoryAdjustmentRepository
} from "@inventory/inventory-adjustment/domain/repositories/inventory-adjustment.repository";
import {InventoryDocumentType, InventoryTransactionType} from "@inventory/domain/enums/inventory.enum";
import {MedidaProducto} from "@inventory/domain/models/measure.model";

export interface CreateInventoryAdjustmentCommand {
  emissionPointId: number;
  documentType: InventoryDocumentType;
  transactionType: InventoryTransactionType;
  emissionDate: Date;
  observations?: string;
  details: CreateInventoryAdjustmentDetailCommand[];
}

export interface CreateInventoryAdjustmentDetailCommand {
  productId: number;
  code: string;
  warehouseId: number;
  unitOfMeasureId: number;
  measures:MedidaProducto[];
  quantity: number;
  transactionQuantity: number;
  unitConversion: number
  unitPrice: number;
  costPrice: number;
  fractionalCostPrice: number;
  description: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateInventoryAdjustmentUseCase {
    private repository = inject(InventoryAdjustmentRepository)
    // private mapper = inject(InventoryAdjustmentMapper)
    // private validateUseCase = inject(ValidateInventoryAdjustmentUseCase)
    // private domainService = inject(IInventoryAdjustmentDomainService)


  execute(command: CreateInventoryAdjustmentCommand)  {
    // 1. Create domain entity
    const adjustment = InventoryAdjustment.create({
      emissionPointId: command.emissionPointId,
      documentType: command.documentType,
      transactionType: command.transactionType,
      emissionDate: command.emissionDate,
      observations: command.observations
    });

    // 2. Add details
    command.details.forEach(detailCommand => {
      adjustment.addDetail({
        productId: detailCommand.productId,
        code: detailCommand.code,
        warehouseId: detailCommand.warehouseId,
        unitOfMeasureId: detailCommand.unitOfMeasureId,
        measures: detailCommand.measures,
        quantity: detailCommand.quantity,
        transactionQuantity: detailCommand.transactionQuantity,
        unitConversion: detailCommand.unitConversion,
        unitPrice: detailCommand.unitPrice,
        costPrice: detailCommand.costPrice,
        fractionalCostPrice: detailCommand.fractionalCostPrice,
        description: detailCommand.description,
        notes: detailCommand.notes
      });
    });

    // 3. Validate business rules
    // return this.validateUseCase.execute(adjustment).pipe(
    //   switchMap(isValid => {
    //     if (!isValid) {
    //       throw new Error('Invalid inventory adjustment according to business rules');
    //     }
    //
    //     // 4. Validate domain rules
    //     return this.domainService.validateInventoryAdjustment(adjustment);
    //   }),
    //   switchMap(isValid => {
    //     if (!isValid) {
    //       throw new Error('Invalid inventory adjustment according to domain rules');
    //     }
    //
    //     // 5. Convert to DTO and save
    //     const dto = this.mapper.toDto(adjustment);
    //     return this.repository.create(dto);
    //   }),
    //   map(savedDto => this.mapper.toDomain(savedDto))
    // );
  }
}
