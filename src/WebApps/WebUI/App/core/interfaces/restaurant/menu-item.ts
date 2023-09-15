import { readonly } from "svelte/store";

export interface MenuItem {
  readonly id?: number;
  menuId?: number;
  itemId?: number;
  quantity?: number;
  percentageDiscount?: number;
  total?: number;

  // for display in the table
  readonly productId?: number;
  descripcion?: string;
}
