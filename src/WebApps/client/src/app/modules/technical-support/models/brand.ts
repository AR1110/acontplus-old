export interface Brand {
  id: number;
  code: string;
  name: string;
  enabled?: boolean;
  categoryId: number;
  categoryName?: string;
  series?: string;
}
