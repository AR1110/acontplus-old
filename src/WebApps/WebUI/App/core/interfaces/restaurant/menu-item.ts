export interface MenuItem {
  readonly id?: number;
  menuId?: number;
  itemId?: number;
  feeId?: number;
  quantity?: number;
  discountPercentage?: number;
  discountValue?: number;

  // for display in the table
  readonly productId?: number;
  descripcion?: string;
  codigo?: string;
  medida?: string;
  fees?: string;
}
