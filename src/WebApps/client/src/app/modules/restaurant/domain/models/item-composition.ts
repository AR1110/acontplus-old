import {generateUuidv4} from "@core/utils/generate-uuidv4";
import {ProductFee, ProductMeasure} from "@inventory/domain/models/product-measure";

export class ItemComposition {
  uuid = generateUuidv4();
  id = 0;
  itemId = 0;
  childItemId = 0;
  fees:ProductFee[]=[]
  feeId = 0;
  taxRateId = 0;
  description = '';
  code = '';
  discountPercent = 0;
  discount = 0;

  measures:ProductMeasure[] = [];
  measureId = 0;
  price = 0;
  costPrice = 0;
  quantity = 1;
  subtotal = 0;
  priceWithTax = 0;
  isActive = true;
  isDeleted = false;
}
