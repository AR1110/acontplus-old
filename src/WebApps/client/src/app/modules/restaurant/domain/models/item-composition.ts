import {generateUuidv4} from "@core/utils/generate-uuidv4";
import {ProductMeasure} from "@inventory/domain/models/product-measure";

export class ItemComposition {
  uuid = generateUuidv4();
  id = 0;
  itemId = 0;
  childItemId = 0;
  feeId = 0;
  taxRateId = 0;
  description = '';
  code = '';
  measures:ProductMeasure[] = [];
  measureId = 0;
  quantity = 1;
  isActive = true;
}
