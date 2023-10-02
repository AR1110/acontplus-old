export interface Menu {
  readonly id: number;
  menuTypeId?: number;
  productId: number;
  title: string;
  summary?: string;
  typeId?: number;
  content?: string;
  startDate?: string;
  endDate?: string;
  promotionDays?: string;
  forPromotion: boolean;
}
