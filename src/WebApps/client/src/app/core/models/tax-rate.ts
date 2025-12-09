export interface TaxRate {
  id: number;
  taxTypeId: number; // VAT only
  rate: number;
  name: string; // 0, 12, 14, null for NO-IVA cases
  code: number; // 0,2,3,6,7,8
}
