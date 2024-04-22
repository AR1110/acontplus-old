import { Category } from './category';
import { Serie } from './serie';

export interface Brand extends Category {
  id: number;
  code: string;
  name: string;
  enabled?: boolean;
  categoryName: string;
  series?: string;
}
