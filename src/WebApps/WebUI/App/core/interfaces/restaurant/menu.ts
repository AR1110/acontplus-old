export interface Menu {
  readonly id: number;
  productId: number;
  title: string;
  summary?: string;
  typeId?: number;
  content?: string;
}
