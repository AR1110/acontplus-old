import { Category } from '@modules/inventory/models/category.model';

export interface Brand extends Category {
  id: number;
  code: string;
  name: string;
  enabled?: boolean;
}
