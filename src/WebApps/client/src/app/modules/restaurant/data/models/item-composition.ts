import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { ProductFee, ProductMeasure } from '@inventory/data/models/product-measure';

export class ItemComposition {
  uuid = generateUuidv4();
  parentUuid: string|null = null;
  id = 0;
  parentItemId = 0;
  childItemId = 0;
  fees: ProductFee[] = [];
  feeId = 0;
  description = '';
  code = '';

  measures: ProductMeasure[] = [];
  measureId = 0;
  salePrice = 0;
  unitPrice = 0;
  quantity = 1;
  totalPrice = 0;
  totalCost = 0;
  isActive = true;
  isDeleted = false;
  children?: ItemComposition[];
  isOptional = false;
  parentCompositionId = 0;

  level = 0;
  constructor(level?: number) {
    this.level = level ?? 0
  }
}
