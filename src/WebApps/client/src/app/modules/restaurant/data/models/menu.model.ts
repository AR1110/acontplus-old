interface MenuItem {
  id: number;
  menuId: number;
  feeId: number;
  itemId: number;
  quantity?: number;
  discountPercent?: number;
  discountValue?: number;
  subtotal?: number;
  enabled: boolean;
}

export interface MenuType {
  id: number;
  code: string;
  name: string;
  enabled: boolean;
}

export interface Menu {
  totalRecords: number;
  id: number;
  productId: number;
  title: string;
  summary?: string;
  menuType: MenuType;
  menuTypeId?: number;
  content?: string;
  forPromotion: boolean;
  menuItems: MenuItem[];
  s3ObjectUrl?: string;
}
