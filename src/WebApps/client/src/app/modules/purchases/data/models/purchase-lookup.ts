import { LookupItem } from '@core/models/lookup-type';

export interface PurchaseLookupResponse {
  establishments: LookupItem[];
  subcategories: LookupItem[];
}
