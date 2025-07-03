import {Injectable} from "@angular/core";
import {InventoryAdjustment} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";
import {Quantity} from "@inventory/inventory-adjustment/domain/value-objects/quantity.vo";
import {Money} from "@inventory/inventory-adjustment/domain/value-objects/money.vo";
import {MedidaProducto} from "@inventory/domain/models/measure.model";

export interface AddDetailToAdjustmentCommand {
  adjustment: InventoryAdjustment;  // Entity in memory
  productId: number;
  code: string;
  warehouseId: number;
  unitOfMeasureId?: number;
  measures: MedidaProducto[]
  quantity: number;
  unitConversion: number
  transactionQuantity: number;
  unitPrice: number;
  costPrice: number;
  fractionalCostPrice: number;
  description: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddDetailToAdjustmentUseCase {

  execute(command: AddDetailToAdjustmentCommand): InventoryAdjustment {
    command.adjustment.addDetail({
      productId: command.productId,
      code: command.code,
      warehouseId: command.warehouseId,
      unitOfMeasureId: command.unitOfMeasureId,
      measures: command.measures,
      quantity: command.quantity,
      unitConversion: command.unitConversion,
      transactionQuantity: command.transactionQuantity,
      unitPrice: command.unitPrice,
      costPrice: command.costPrice,
      fractionalCostPrice: command.fractionalCostPrice,
      description: command.description,
      notes: command.notes
    });


    return command.adjustment;
  }
}
