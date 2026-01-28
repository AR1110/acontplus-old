export interface Menu {
  id: number;
  aplicacionId: number;
  name: string;
  code: string;
  url: string;
  icon?: string;
  order: number;
  parentId?: number | null;
  children?: Menu[];
  isActive: boolean;
}
