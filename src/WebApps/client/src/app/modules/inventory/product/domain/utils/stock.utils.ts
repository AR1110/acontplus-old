import { isDateValid } from '@core/utils/date.util';

interface MergeOptions {
  rowUUID?: string; // UUID del StockItem a buscar
}

interface ConsolidacionBodega {
  idBodega: number;
  fechaConsolidacion: string;
  // ... otros campos
}

// El UUID está en el StockItem, y el ajuste es un array
interface StockItem {
  productId: number;
  warehouseId: number;
  measureId: number;
  quantity: number;
  measures: any[];
  uuid: string;
  inventoryAdjustments?: ConsolidacionBodega[];
}

interface MergedResult {
  quantity: number;
  stockQuantity: number;
  warehouseId: number;
  measureId: number;
  productId: number;
  inventoryAdjustment?: ConsolidacionBodega;
}

export function mergeStockItems(items: StockItem[], options?: MergeOptions): MergedResult {
  // 1. Agrupación usando Map para mayor seguridad y claridad
  const grouped = items.reduce((acc, item) => {
    const key = `${item.productId}_${item.warehouseId}_${item.measureId}`;
    if (!acc.has(key)) {
      acc.set(key, []);
    }
    acc.get(key)!.push(item);
    return acc;
  }, new Map<string, StockItem[]>());

  if (items.length === 0) {
    return {
      quantity: 0,
      stockQuantity: 0,
      warehouseId: 0,
      measureId: 0,
      productId: 0,
      inventoryAdjustment: undefined,
    };
  }

  let totalQuantity = 0;
  let totalStock = 0;
  let warehouseId = 0;
  let measureId = 0;
  let productId = 0;

  // 2. Iteración con for...of para cálculo de totales
  for (const group of grouped.values()) {
    const totals = group.reduce(
      (acc, item) => {
        // Lógica de cálculo
        const fractional = item.measures.find(
          (m: any) => m.idMedida === item.measureId && m.tipo === 'FRACCIONADO',
        );
        const principal = item.measures.find(
          (m: any) => m.idMedida === item.measureId && m.tipo === 'PRINCIPAL',
        );
        if (fractional) acc.fractional += item.quantity * fractional.conversion;
        if (principal) acc.principal += item.quantity * principal.conversion;
        acc.quantity += item.quantity;
        return acc;
      },
      { fractional: 0, principal: 0, quantity: 0 },
    );

    totalQuantity += totals.quantity;
    totalStock += totals.fractional + totals.principal;

    warehouseId = group[0].warehouseId;
    measureId = group[0].measureId;
    productId = group[0].productId;
  }

  let adjustment: ConsolidacionBodega | undefined;
  let finalMeasureId = measureId;
  let finalProductId = productId;
  let finalWarehouseId = warehouseId;
  // A. Prioridad: Buscar el StockItem por UUID
  if (options?.rowUUID) {
    const itemByUuid = items.find((item) => item.uuid === options.rowUUID);

    if (itemByUuid) {
      // 3.1: Buscar el ajuste DENTRO del array inventoryAdjustments del ítem encontrado
      adjustment = itemByUuid.inventoryAdjustments?.find(
        (ia) => ia.idBodega === itemByUuid.warehouseId,
      );

      // 3.2: Si se encontró el ítem, usar sus IDs para el resultado final,
      //      ya que el UUID apunta a una fila específica.
      finalMeasureId = itemByUuid.measureId;
      finalProductId = itemByUuid.productId;
      finalWarehouseId = itemByUuid.warehouseId;
    }
  }

  return {
    quantity: totalQuantity,
    stockQuantity: totalStock,
    warehouseId: adjustment?.idBodega ?? finalWarehouseId,
    measureId: finalMeasureId,
    productId: finalProductId,
    inventoryAdjustment: adjustment,
  };
}

interface GetStockQuantityProps {
  issueDate: Date;
  stockQuantity: number;
  adjustment?: ConsolidacionBodega;
}
export function getStockQuantity({
  issueDate,
  stockQuantity,
  adjustment,
}: GetStockQuantityProps): number {
  if (!adjustment) return stockQuantity;

  const consolidationDate = new Date(adjustment.fechaConsolidacion);
  const isAfterOrEqual = isDateValid(consolidationDate) && consolidationDate >= issueDate;

  return isAfterOrEqual ? 0 : stockQuantity;
}
