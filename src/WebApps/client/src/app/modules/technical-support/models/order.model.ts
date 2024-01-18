import { OrderDetail } from './order-detail';
import { OrderStatus } from './order-status';
import { BaseEntity } from '@core/models/base-entity';

export interface Order extends BaseEntity {
  uuid: string;
  establecimientoId: number;
  puntoEmisionId: number;
  sequence: number;
  serie: string;
  customerCompanyId: number;
  tax: number | null;
  discount: number | null;
  tip: number | null;
  total: number;
  obs: string;
  orderStatus: OrderStatus;
  orderStatusId: number;
  orderDetails: OrderDetail[];
}
