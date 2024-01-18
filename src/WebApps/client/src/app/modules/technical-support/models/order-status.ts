import { BaseEntity } from '@core/models/base-entity';

export interface OrderStatus extends BaseEntity {
  code: string;
  name: string;
  order: number;
}
