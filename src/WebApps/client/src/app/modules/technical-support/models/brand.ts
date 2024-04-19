import { Category } from './category';

export interface Brand extends Category {
  id: number;
  code: string;
  name: string;
  enabled?: boolean;
  categoryName: string;
}
